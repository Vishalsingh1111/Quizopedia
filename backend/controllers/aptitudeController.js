import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Allowed aptitude topics
 */
const ALLOWED_TOPICS = new Set([
    "Percentage", "Ratio", "Distance", "Permutation", "Profit and loss", "Average", "Compound interest",
    "Probability", "Time and work", "Numeral system", "Problem on Ages", "Algebra", "Boats and Streams",
    "Greatest common divisor", "Problems on Trains", "Geometry", "Mensuration", "Mixtures and alligation",
    "Pipes and Cistern", "Simple Interest", "Calendar and clocks", "Logical reasoning", "Area", "Partnership"
]);

/**
 * Generate MCQs for aptitude quizzes
 */
export const generateAptitudeMCQs = async (req, res) => {
    try {
        let { topic = "Percentage", level = "easy", count = 10 } = req.body;
        count = Math.min(Math.max(parseInt(count) || 10, 1), 20);

        console.log(`🤖 Generating ${count} MCQs on ${topic}`);

        // Validate topic & level
        if (!topic || !ALLOWED_TOPICS.has(topic)) {
            console.error('❌ Invalid topic:', topic);
            return res.status(400).json({ error: "Invalid or missing topic. Only aptitude topics allowed." });
        }
        if (!["easy", "medium", "hard"].includes(level)) {
            console.warn('⚠️ Invalid level, defaulting to easy');
            level = "easy";
        }

        // Updated prompt to include explanations
        const prompt = `You are an aptitude quiz generator. Generate exactly ${count} multiple-choice questions (4 options each) ONLY on the aptitude topic "${topic}" and difficulty "${level}".

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string],
  "answer": string,
  "explanation": string (2-3 sentences explaining the solution approach and calculation)
}

Where "answer" must exactly equal one of the options. Ensure questions are aptitude-focused with detailed step-by-step explanations of the solution process. Provide varied numeric and reasoning formats appropriate to the topic and difficulty.`;

        const model = getGeminiModel();

        // Add timeout and better error handling for the API call
        const result = await Promise.race([
            model.generateContent(prompt),
            // new Promise((_, reject) =>
            //     setTimeout(() => reject(new Error('API timeout after 90 seconds')), 90000)
            // )
        ]);

        const text = (await result.response).text();
        console.log('✅ Received response from Gemini API');

        const mcqs = extractAndParseJSON(text);

        if (!Array.isArray(mcqs) || mcqs.length === 0) {
            throw new Error('Invalid or empty MCQ data received from API');
        }

        // Validate that each MCQ has the required fields including explanation
        const validatedMcqs = mcqs.slice(0, count).map((mcq, index) => {
            // Validate required fields
            if (!mcq.question || !mcq.options || !Array.isArray(mcq.options) || !mcq.answer) {
                console.warn(`⚠️ Invalid MCQ at index ${index}, using fallback`);
                return {
                    question: `Sample aptitude question ${index + 1} about ${topic}?`,
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

        console.log(`✅ Successfully generated ${validatedMcqs.length} MCQs for ${topic}`);

        res.json({
            mcqs: validatedMcqs,
            topic,
            level,
            count: validatedMcqs.length,
            generated: new Date().toISOString()
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