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
    const recommendations = retrieved.slice(0, 4).map((p, idx) => {
        const payload = p.payload || p;
        const crop = payload.crop || payload.Crop || `Crop_${idx + 1}`;

        const annualRainfall = payload.annual_rainfall || 1000;
        const water_per_day = Math.round(Math.max(1000, 3000 - annualRainfall / 1) * size);
        const nitrogen = Math.round((payload.fertilizer || payload.fertilizer_usage || 20) * size);
        const phosphorus = Math.round((payload.phosphorus || 15) * size);
        const potassium = Math.round((payload.potassium || 15) * size);
        const expected_output = Math.round((payload.production || payload.yield || 1) * size * 1000);
        const lower_profit = Math.round((expected_output * 10));
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

// ---------- Get current weather context via Gemini ----------
async function getWeatherContext(location: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API;
    if (!geminiKey) return "Weather data unavailable.";

    try {
        const weatherPrompt = `You are a meteorological expert. For the location "${location}" in India, provide a concise weather summary for the current farming season (February 2026). Include:
1. Current temperature range (day/night)
2. Expected rainfall in the next 3 months
3. Soil moisture conditions
4. Any weather advisories for farmers
Keep it under 100 words. Return plain text only.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: weatherPrompt }] }],
                generationConfig: { maxOutputTokens: 200 }
            })
        });

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Weather data unavailable.";
    } catch (err) {
        console.error("Gemini weather fetch error:", err);
        return "Weather data unavailable.";
    }
}

export async function POST(req: Request) {
    try {
        const { location, size, previously_grown, budget, soil_type, water_source, season } = await req.json();

        if (!location || !size || !budget) {
            return NextResponse.json({ error: "Missing required fields: location, size, budget" }, { status: 400 });
        }

        const landSize = Number(size);
        const userBudget = Number(budget);

        if (isNaN(landSize) || isNaN(userBudget) || landSize <= 0 || userBudget <= 0) {
            return NextResponse.json({ error: "Invalid size or budget values" }, { status: 400 });
        }

        // Build a concise user query for embedding & search
        const userText = `Location: ${location}; Size: ${size} acres; Soil: ${soil_type || "unknown"}; Water: ${water_source || "unknown"}; Season: ${season || "unknown"}; Previously: ${previously_grown || "none"}; Budget: ${budget}`;

        // 1) Embed query
        const qvec = await embed(userText);

        // 2) Qdrant search (top 10 for richer context)
        const searchRes = await qdrant.search(COLLECTION, {
            vector: qvec,
            limit: 10,
        });

        const retrieved = (searchRes || []).map(hit => ({
            payload: hit.payload || hit,
            score: hit.score || 0
        }));

        // 3) Fetch real-time weather context via Gemini
        const weatherContext = await getWeatherContext(location);

        // 4) Build the RAG context from historical data
        const ragContext = retrieved.slice(0, 8).map((r, i) => {
            const p: any = r.payload;
            return `#${i + 1} Crop:${p.crop || p.Crop || "unknown"}, State:${p.state || p.State || "unknown"}, Season:${p.season || p.Season || "unknown"}, Yield:${p.yield || p.Yield || ""}, Production:${p.production || p.Production || ""}, AnnualRainfall:${p.annual_rainfall || ""}, Fertilizer:${p.fertilizer || p.fertilizer_usage || ""}, Area:${p.area || p.Area || ""}`;
        }).join("\n");

        // 5) Engineer the master prompt — 4 recommendations blended seamlessly
        const systemPrompt = `You are a world-class agronomist and agricultural data scientist specializing in Indian farming.

YOUR INTELLIGENCE SOURCES (use all three, but NEVER reveal these categories to the user):
A) WEATHER: Real-time weather/climate conditions for the farmer's location.
B) AI EXPERTISE: Your deep knowledge of agronomy — crop rotation, market demand trends, soil health, pest cycles, and profitability analysis.
C) HISTORICAL RECORDS: Verified crop yield/production data from the farmer's region.

YOUR TASK: Produce exactly 4 crop recommendations using this internal strategy (DO NOT EXPOSE):
- Crop 1: Best fit for CURRENT WEATHER conditions (temp, rainfall, humidity) + smart reasoning.
- Crop 2: YOUR intelligent pick — consider crop rotation benefit (given what was grown before), market demand, innovative/high-value/underrated crop, or best ROI opportunity.
- Crop 3: Strongest performer in HISTORICAL DATA for this region.
- Crop 4: Another HISTORICAL DATA pick — but from a DIFFERENT crop family/season for diversification.

ABSOLUTE RULES (VIOLATION = FAILURE):
1. ALL 4 CROPS MUST BE COMPLETELY DIFFERENT. No two crops can be the same or even similar varieties (e.g., no "Rice" and "Paddy", no "Wheat" and "Durum Wheat"). Each must be a distinct species.
2. EVERY CROP MUST HAVE DISTINCTLY DIFFERENT NUMBERS. Each crop has unique water, NPK, yield, and profit characteristics. For reference (per acre):
   - Water: Rice needs ~8000-12000 L/day, Wheat ~3000-5000, Pulses ~1500-2500, Vegetables ~4000-7000, Cotton ~5000-8000
   - Nitrogen: Rice ~25-40kg, Wheat ~30-50kg, Sugarcane ~60-80kg, Pulses ~8-15kg, Oilseeds ~15-25kg
   - Phosphorus: typically 40-70% of nitrogen value, varies by crop
   - Potassium: typically 30-60% of nitrogen value, varies by crop
   - Yield: Rice ~800-1200kg/acre, Wheat ~700-1000kg, Sugarcane ~25000-35000kg, Vegetables ~3000-8000kg, Cotton ~300-500kg
   - Profit: directly proportional to yield × market price, minus input costs
   - Budget: different crops have very different input costs (sugarcane is expensive, pulses are cheap)
3. Scale ALL numbers to the user's actual land size. Multiply per-acre values by acreage.
4. The "why" field must sound like a holistic expert opinion blending climate, soil, data, and market reasoning. Never say "based on weather" or "based on historical data."
5. Each fertilizer list should have 3-5 specific Indian fertilizer products (Urea, DAP, MOP, SSP, Zinc Sulphate, Gypsum, etc.) with DIFFERENT quantities per crop.
6. top_similar_crops must list 3 genuinely different alternative crops for each recommendation.
7. expected_profit_range_rs must have a meaningful spread (min should be 60-75% of max, NOT identical).
8. Output ONLY valid JSON array. No markdown, no backticks, no explanation.`;

        const userPrompt = `FARMER PROFILE:
- Location: ${location}
- Land: ${size} acres
- Soil Type: ${soil_type || "not specified"}
- Water Source: ${water_source || "not specified"}
- Planting Season: ${season || "not specified"}
- Previous crop: ${previously_grown || "none"}
- Budget: ₹${budget}

LIVE WEATHER for ${location}:
${weatherContext}

HISTORICAL CROP DATA (from database):
${ragContext}

IMPORTANT CONSTRAINTS FROM FARMER INPUTS:
- Soil type "${soil_type}" means you MUST only recommend crops that thrive in this soil. For example: Black soil → Cotton, Soybean, Sugarcane; Red soil → Groundnut, Millets, Pulses; Alluvial → Rice, Wheat, Maize; Sandy → Groundnut, Watermelon, Bajra.
- Water source "${water_source}" determines water availability. "Rain-fed Only" means NO water-intensive crops like Sugarcane or Rice. "Drip Irrigation" favors vegetables and fruits.
- Season "${season}" means ONLY recommend crops suitable for this season. Kharif → Rice, Cotton, Maize, Soybean; Rabi → Wheat, Gram, Mustard, Barley; Zaid → Watermelon, Cucumber, Moong.

OUTPUT: JSON array of exactly 4 objects, each with this schema:
{
  "recommended_crop": "CropName",
  "why": "2-3 sentence expert justification blending soil, water, season, weather, and market reasoning",
  "requirements": {
    "water_liters_per_day": number (scaled to ${size} acres, MUST differ significantly between crops),
    "nitrogen_kg": number (scaled to ${size} acres),
    "phosphorus_kg": number (scaled, typically 40-70% of nitrogen),
    "potassium_kg": number (scaled, typically 30-60% of nitrogen),
    "fertilizers": [{"name": "specific Indian fertilizer", "amount_kg": number}, ...] (3-5 items, different per crop)
  },
  "expected_output_kg": number (realistic for ${size} acres of this specific crop),
  "expected_profit_range_rs": [min_number, max_number] (min = 60-75% of max),
  "estimated_budget_needed_rs": number (must differ per crop based on input costs),
  "top_similar_crops": ["alt1", "alt2", "alt3"]
}

REMEMBER: 4 DIFFERENT crops, 4 DIFFERENT sets of numbers. No duplicates. Respect soil/water/season constraints. JSON only.`;

        // 6) Call OpenAI LLM
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.25,
            max_tokens: 1600
        });

        const modelText = completion.choices?.[0]?.message?.content ?? "";

        // 7) Extract JSON
        let parsed = extractJson(modelText);

        // 8) Validate shape
        const validArray = Array.isArray(parsed) && parsed.length === 4 && parsed.every(item =>
            item && typeof item.recommended_crop === "string" &&
            item.requirements && typeof item.requirements.water_liters_per_day === "number"
        );

        if (!validArray) {
            parsed = extractJson(modelText.replace(/```(json)?/g, ""));
        }

        // 9) Deduplicate crops & validate
        let finalOutput;
        let validParsed = Array.isArray(parsed) && parsed.length >= 1 ? parsed : null;

        // Remove duplicate crops (case-insensitive)
        if (validParsed) {
            const seen = new Set<string>();
            validParsed = validParsed.filter((item: any) => {
                const cropName = (item.recommended_crop || "").toLowerCase().trim();
                if (seen.has(cropName)) return false;
                seen.add(cropName);
                return true;
            });
        }

        const isValidOutput = validParsed && validParsed.length >= 1;

        if (isValidOutput) {
            finalOutput = validParsed!.slice(0, 4).map((item: any, idx: number) => {
                const req = item.requirements || {};
                return {
                    recommended_crop: item.recommended_crop || `Crop_${idx + 1}`,
                    why: item.why || "Synthesized from weather, historical data, and agronomic reasoning.",
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
            finalOutput = fallbackFromRetrieved(retrieved, landSize, userBudget);
        }

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
