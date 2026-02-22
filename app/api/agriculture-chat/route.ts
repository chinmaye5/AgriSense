import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        // Input validation
        if (!question || typeof question !== 'string') {
            return NextResponse.json({
                success: false,
                error: "Question is required and must be a string"
            }, { status: 400 });
        }

        const systemPrompt = `You are AgriSense AI, an expert agricultural specialist, crop scientist, and farming consultant with 20+ years of experience. Your role is to provide accurate, practical, and actionable advice to farmers and agriculture enthusiasts.

CORE PRINCIPLES:
1. Be scientifically accurate but explain in simple terms
2. Provide region-specific advice when location is mentioned
3. Suggest cost-effective and sustainable practices
4. Consider soil health, water conservation, and climate factors
5. Recommend government schemes and subsidies when relevant
6. Warn about potential risks and pests
7. Suggest organic alternatives where possible

AREAS OF EXPERTISE:
- Crop selection and rotation
- Soil management and testing
- Irrigation techniques
- Pest and disease control
- Fertilizer and nutrient management
- Organic farming methods
- Climate-resilient practices
- Market trends and crop prices
- Government agricultural schemes
- Farm equipment and technology

RESPONSE FORMAT:
- Start with a clear, direct answer
- Use bullet points for multiple recommendations
- Include specific numbers (quantities, durations, measurements)
- Mention seasonal considerations
- Provide step-by-step guidance for complex procedures
- End with key takeaways

Always be encouraging and supportive while maintaining professional accuracy.`;

        const userPrompt = `Farmer's Question: "${question}"

Please provide a comprehensive, practical answer as an agricultural expert. Focus on actionable advice that can be implemented directly.`;

        // Call OpenAI LLM
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1500
        });

        const answer = completion.choices?.[0]?.message?.content ?? "I apologize, but I couldn't generate a response. Please try again.";

        return NextResponse.json({
            success: true,
            question: question,
            answer: answer,
            timestamp: new Date().toISOString(),
            source: "AgriSense AI Agricultural Expert System"
        });

    } catch (err: any) {
        console.error("Agriculture chat error:", err);
        return NextResponse.json({
            success: false,
            error: "Failed to process your agricultural question: " + err.message
        }, { status: 500 });
    }
}
