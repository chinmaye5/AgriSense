import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});
const COLLECTION = "crop_recommendation_data";

// ---------- embed helper ----------
async function embed(text: string) {
    const resp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return resp.data[0].embedding;
}

// ---------- helper: try to extract JSON from text ----------
function extractJson(text: string | null) {
    if (!text) return null;

    // Try direct parse
    try {
        return JSON.parse(text);
    } catch (e) {
        // Try to extract first {...} block
        const match = text.match(/(\{[\s\S]*\})/);
        if (match) {
            try {
                return JSON.parse(match[1]);
            } catch (e2) {
                // Continue to next attempt
            }
        }
        // Try to extract array [...]
        const matchArr = text.match(/(\[[\s\S]*\])/);
        if (matchArr) {
            try {
                return JSON.parse(matchArr[1]);
            } catch (e3) {
                return null;
            }
        }
        return null;
    }
}

// ---------- fallback builder (if model fails) ----------
function fallbackFromRetrieved(retrieved: any[], size: number, budget: number) {
    // Use the top 3 retrieved payloads and build reasonable numeric placeholders
    const recommendations = retrieved.slice(0, 3).map((p, idx) => {
        const payload = p.payload || p;
        const crop = payload.crop || payload.Crop || `Crop_${idx + 1}`;

        // basic heuristics (scaled by size): these are conservative estimates
        const annualRainfall = payload.annual_rainfall || 1000;
        const water_per_day = Math.round(Math.max(1000, 3000 - annualRainfall / 1) * size);
        const nitrogen = Math.round((payload.fertilizer || payload.fertilizer_usage || 20) * size);
        const phosphorus = Math.round((payload.phosphorus || 15) * size);
        const potassium = Math.round((payload.potassium || 15) * size);
        const expected_output = Math.round((payload.production || payload.yield || 1) * size * 1000); // kg estimate
        const lower_profit = Math.round((expected_output * 10)); // crude
        const upper_profit = Math.round((expected_output * 25));

        return {
            recommended_crop: crop,
            why: `Derived from similar historical records and user land info.`,
            requirements: {
                water_liters_per_day: water_per_day,
                nitrogen_kg: nitrogen,
                phosphorus_kg: phosphorus,
                potassium_kg: potassium,
                fertilizers: [
                    { name: "Urea (est)", amount_kg: Math.round(nitrogen * 0.7) },
                    { name: "DAP (est)", amount_kg: Math.round(phosphorus * 0.6) }
                ]
            },
            expected_output_kg: expected_output,
            expected_profit_range_rs: [lower_profit, upper_profit],
            estimated_budget_needed_rs: Math.round((nitrogen + phosphorus + potassium) * 80 + expected_output * 2),
            top_similar_crops: retrieved.slice(0, 5).map(r => {
                const rPayload = r.payload || r;
                return rPayload.crop || rPayload.Crop;
            }).filter(Boolean)
        };
    });

    return recommendations;
}

export async function POST(req: Request) {
    try {
        const { location, size, previously_grown, budget } = await req.json();

        // Input validation
        if (!location || !size || !budget) {
            return NextResponse.json({ error: "Missing required fields: location, size, budget" }, { status: 400 });
        }

        const landSize = Number(size);
        const userBudget = Number(budget);

        if (isNaN(landSize) || isNaN(userBudget) || landSize <= 0 || userBudget <= 0) {
            return NextResponse.json({ error: "Invalid size or budget values" }, { status: 400 });
        }

        // Build a concise user query for embedding & search
        const userText = `Location: ${location}; Size: ${size} acres; Previously: ${previously_grown || "none"}; Budget: ${budget}`;

        // 1) Embed query
        const qvec = await embed(userText);

        // 2) Qdrant search (top 8 to have good context)
        const searchRes = await qdrant.search(COLLECTION, {
            vector: qvec,
            limit: 8,
        });

        // Normalize retrieved payloads
        const retrieved = (searchRes || []).map(hit => {
            return {
                payload: hit.payload || hit,
                score: hit.score || 0
            };
        });

        // 3) Build model prompt (RAG context + instruction to reason)
        const ragContext = retrieved.slice(0, 6).map((r, i) => {
            const p: any = r.payload;
            return `#${i + 1} Crop:${p.crop || p.Crop || "unknown"}, State:${p.state || p.State || "unknown"}, Yield:${p.yield || p.Yield || ""}, Production:${p.production || p.Production || ""}, AnnualRainfall:${p.annual_rainfall || ""}`;
        }).join("\n");

        const systemPrompt = `You are an expert agronomist and data scientist. Use the retrieved similar-crop records below only as reference. Think for yourself and synthesize the best three crop recommendations for the user's land. Be conservative and practical. Output EXACTLY valid JSON only (no extra text).`;

        const userPrompt = `
User land:
- Location: ${location}
- Size (acres): ${size}
- Previously grown: ${previously_grown || "none"}
- Budget (INR): ${budget}

Retrieved similar crop records (for reference):
${ragContext}

Return JSON: an array of 3 objects (length exactly 3). Each object must have these fields:
{
  "recommended_crop": string,
  "why": string,
  "requirements": {
     "water_liters_per_day": number,
     "nitrogen_kg": number,
     "phosphorus_kg": number,
     "potassium_kg": number,
     "fertilizers": [{ "name": string, "amount_kg": number }]
  },
  "expected_output_kg": number,
  "expected_profit_range_rs": [number, number],
  "estimated_budget_needed_rs": number,
  "top_similar_crops": [string]
}

Make numbers realistic and scaled to the provided size. Use data in retrieved records only as reference — prioritize agricultural reason. Provide ranges for profit, not single numbers.
    `;

        // 4) Call OpenAI LLM
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            max_tokens: 800
        });

        const modelText = completion.choices?.[0]?.message?.content ?? "";

        // 5) Extract JSON
        let parsed = extractJson(modelText);

        // 6) Validate shape lightly
        const validArray = Array.isArray(parsed) && parsed.length === 3 && parsed.every(item =>
            item && typeof item.recommended_crop === "string" &&
            item.requirements && typeof item.requirements.water_liters_per_day === "number"
        );

        if (!validArray) {
            // attempt to extract again from content (maybe model returned with backticks)
            parsed = extractJson(modelText.replace(/```(json)?/g, ""));
        }

        // 7) Final fallback: if still invalid, use heuristic from retrieved
        let finalOutput;
        const isValidOutput = Array.isArray(parsed) && parsed.length >= 1;

        if (isValidOutput) {
            // If model returned >=1, ensure only 3 items and normalize fields
            finalOutput = parsed.slice(0, 3).map((item: any, idx: number) => {
                // normalize some fields, ensure numeric values
                const req = item.requirements || {};
                return {
                    recommended_crop: item.recommended_crop || `Crop_${idx + 1}`,
                    why: item.why || "Synthesized from retrieved records and agronomic reasoning.",
                    requirements: {
                        water_liters_per_day: Number(req.water_liters_per_day || 0),
                        nitrogen_kg: Number(req.nitrogen_kg || 0),
                        phosphorus_kg: Number(req.phosphorus_kg || 0),
                        potassium_kg: Number(req.potassium_kg || 0),
                        fertilizers: Array.isArray(req.fertilizers) ? req.fertilizers.map((f: any) => ({
                            name: f.name || "Unknown",
                            amount_kg: Number(f.amount_kg || 0)
                        })) : []
                    },
                    expected_output_kg: Number(item.expected_output_kg || 0),
                    expected_profit_range_rs: Array.isArray(item.expected_profit_range_rs) ?
                        item.expected_profit_range_rs.map(Number) : [0, 0],
                    estimated_budget_needed_rs: Number(item.estimated_budget_needed_rs || 0),
                    top_similar_crops: Array.isArray(item.top_similar_crops) ?
                        item.top_similar_crops.slice(0, 5) : []
                };
            });
        } else {
            // use fallback heuristic
            finalOutput = fallbackFromRetrieved(retrieved, landSize, userBudget);
        }

        // return final result
        return NextResponse.json({
            success: true,
            recommendations: finalOutput,
            rag_used: retrieved.slice(0, 3).map(r => r.payload)
        });

    } catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json({
            success: false,
            error: "Internal server error: " + err.message
        }, { status: 500 });
    }
}
