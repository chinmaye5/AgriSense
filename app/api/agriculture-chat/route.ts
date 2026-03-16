import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { question, language = 'en', imageUrl } = await req.json();

        // Language Mapping
        const languageMap: Record<string, string> = {
            'en': 'English',
            'hi': 'Hindi',
            'kn': 'Kannada',
            'te': 'Telugu',
            'ta': 'Tamil',
            'mr': 'Marathi',
            'pa': 'Punjabi',
            'bn': 'Bengali',
            'gu': 'Gujarati'
        };
        const fullLanguage = languageMap[language] || 'English';

        // Input validation
        if ((!question || typeof question !== 'string') && !imageUrl) {
            return NextResponse.json({
                success: false,
                error: "Question or image is required"
            }, { status: 400 });
        }

        const hasImage = !!imageUrl;

        const systemPrompt = `You are AgriSense AI, an expert agricultural specialist, crop scientist, and farming consultant with 20+ years of experience. Your role is to provide accurate, practical, and actionable advice to farmers and agriculture enthusiasts.

        CRITICAL: The user's interface is set to ${fullLanguage}. You MUST provide your entire response in ${fullLanguage}, even if the user asks their question in a different language (like English). 
        If ${fullLanguage} is an Indian language, use its official native script and character set. Do not use English/Romani scripts for Indian languages.

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
        ${hasImage ? `
        IMAGE ANALYSIS EXPERTISE:
        - Crop disease identification from photos
        - Pest damage assessment
        - Nutrient deficiency diagnosis from leaf/plant appearance
        - Soil condition evaluation from visual cues
        - Weed identification
        - Growth stage assessment
        
        When analyzing an image:
        1. First identify the crop/plant if possible
        2. Identify any visible diseases, pests, or deficiencies
        3. Provide a clear diagnosis with confidence level
        4. Explain the cause of the problem
        5. Recommend immediate treatment steps
        6. Suggest preventive measures for the future
        7. Mention any organic alternatives for treatment
        ` : ''}

        RESPONSE FORMAT:
        - Start with a clear, direct answer
        - Use bullet points for multiple recommendations
        - Include specific numbers (quantities, durations, measurements)
        - Mention seasonal considerations
        - Provide step-by-step guidance for complex procedures
        - End with key takeaways

        Always be encouraging and supportive while maintaining professional accuracy.`;

        // Build user message content based on whether image is present
        let userContent: any;

        if (hasImage) {
            const textPart = question 
                ? `Farmer's Question: "${question}"\n\nThe farmer has uploaded an image of their crop. Please analyze the image carefully and provide diagnosis, treatment advice, and preventive measures in ${fullLanguage}.`
                : `The farmer has uploaded an image of their crop for analysis. Please carefully examine this image and:\n1. Identify the crop/plant\n2. Identify any diseases, pest damage, or nutrient deficiencies visible\n3. Provide a diagnosis\n4. Recommend treatment and preventive measures\n\nProvide your entire response in ${fullLanguage}.`;

            userContent = [
                { type: "text" as const, text: textPart },
                { type: "image_url" as const, image_url: { url: imageUrl, detail: "high" as const } }
            ];
        } else {
            userContent = `Farmer's Question: "${question}"\n\nPlease provide a comprehensive, practical answer as an agricultural expert in ${fullLanguage}. Focus on actionable advice that can be implemented directly. Ensure the entire response is in ${fullLanguage}.`;
        }

        // Use gpt-4o for image analysis (vision capable), gpt-4o-mini for text only
        const model = hasImage ? "gpt-4o" : "gpt-4o-mini";

        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            temperature: 0.3,
            max_tokens: hasImage ? 2000 : 1500
        });

        const answer = completion.choices?.[0]?.message?.content ?? "I apologize, but I couldn't generate a response. Please try again.";

        return NextResponse.json({
            success: true,
            question: question || (hasImage ? "🖼️ Image Analysis" : ""),
            answer: answer,
            timestamp: new Date().toISOString(),
            source: hasImage ? "AgriSense AI Crop Disease Analysis" : "AgriSense AI Agricultural Expert System",
            imageAnalyzed: hasImage
        });

    } catch (err: any) {
        console.error("Agriculture chat error:", err);
        return NextResponse.json({
            success: false,
            error: "Failed to process your agricultural question: " + err.message
        }, { status: 500 });
    }
}
