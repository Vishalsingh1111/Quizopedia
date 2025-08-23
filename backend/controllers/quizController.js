
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

export const healthCheck = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
};

export const generateMCQs = async (req, res) => {
    const { topic = "General Knowledge", count = 10 } = req.body;

    // Move questionCount outside try-catch so it's available in catch block
    const questionCount = Math.min(Math.max(parseInt(count) || 10, 1), 20);

    try {
        if (!topic.trim()) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // Updated prompt to include explanations
        const prompt = `Generate exactly ${questionCount} multiple choice questions about "${topic}".

Requirements:
1. Each question should have exactly 4 options (A, B, C, D)
2. Include the correct answer
3. Provide a detailed explanation (2-3 sentences) for why the correct answer is right
4. Make questions educational and informative

Format as JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option text (must match exactly one of the options)",
    "explanation": "Detailed explanation of why this answer is correct, including relevant facts or reasoning (2-3 sentences)."
  }
]

Topic: ${topic}
Number of questions: ${questionCount}

Return only valid JSON array, no other text.`;

        console.log('🤖 Generating MCQs for topic:', topic, 'Count:', questionCount);

        const model = getGeminiModel();

        // Add timeout and better error handling for the API call
        const result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('API timeout after 90 seconds')), 90000)
            )
        ]);

        const text = (await result.response).text();
        console.log('✅ Received response from Gemini API');

        const mcqs = extractAndParseJSON(text);

        if (!Array.isArray(mcqs) || mcqs.length === 0) {
            throw new Error('Invalid or empty MCQ data received from API');
        }

        // Validate that each MCQ has the required fields including explanation
        const validatedMcqs = mcqs.slice(0, questionCount).map((mcq, index) => {
            // Validate required fields
            if (!mcq.question || !mcq.options || !Array.isArray(mcq.options) || !mcq.answer) {
                console.warn(`⚠️ Invalid MCQ at index ${index}, using fallback`);
                return {
                    question: `Sample question ${index + 1} about ${topic}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    answer: "Option A",
                    explanation: `This is the correct answer for question ${index + 1} about ${topic}. This represents a fundamental concept in the subject area.`
                };
            }

            if (!mcq.explanation || mcq.explanation.trim().length === 0) {
                // Fallback explanation if missing
                mcq.explanation = `The correct answer is "${mcq.answer}". This is the most accurate option based on established facts about ${topic}.`;
            }
            return mcq;
        });

        console.log(`✅ Successfully generated ${validatedMcqs.length} MCQs`);

        res.json({
            mcqs: validatedMcqs,
            topic,
            count: validatedMcqs.length
        });

    } catch (error) {
        console.error("❌ Gemini generation failed:", error.message);

        // Return API limit hit error instead of fallback questions
        return res.status(503).json({
            error: "API_LIMIT_HIT",
            message: "API limit reached. Please try again later."
        });
    }
};