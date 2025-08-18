import AptitudeQuizHistory from "../models/AptitudeModel.js";
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
};

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

        let mcqs = [];
        let fallback = false;

        try {
            const model = getGeminiModel();
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            console.log('✅ Received response from Gemini API');

            mcqs = extractAndParseJSON(text);

        } catch (err) {
            console.error("❌ Gemini generation failed:", err.message);
            console.log('⚠️ Using fallback question generator');
            mcqs = generateFallbackAptitudeMCQs(topic, count);
            fallback = true;
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            console.error('❌ No valid MCQs generated');
            return res.status(500).json({ error: "Failed to generate MCQs" });
        }

        const finalMcqs = mcqs.slice(0, count);
        console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for ${topic}`);

        res.json({
            mcqs: finalMcqs,
            topic,
            level,
            fallback,
            generated: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ generateAptitudeMCQs error:", error);
        res.status(500).json({
            error: "Failed to generate MCQs",
            details: error.message
        });
    }
};

/**
 * Save quiz history
 */
export const aptitudesaveHistory = async (req, res) => {
    try {
        const { topic, level, score, total } = req.body;
        if (!topic || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const entry = await AptitudeQuizHistory.create({
            topic: topic.trim(),
            level: level || "easy",
            score: parseInt(score),
            total: parseInt(total)
        });

        res.json({ success: true, id: entry._id, timestamp: entry.timestamp });
    } catch (err) {
        console.error("saveHistory error:", err);
        res.status(500).json({ error: "Failed to save history", details: err.message });
    }
};

/**
 * Get recent quiz history
 */
export const aptitudegetHistory = async (req, res) => {
    try {
        const history = await AptitudeQuizHistory.find().sort({ timestamp: -1 }).limit(50);
        res.json({ history, total: history.length });
    } catch (err) {
        console.error("getHistory error:", err);
        res.status(500).json({ error: "Failed to fetch history", details: err.message });
    }
};

/**
 * Fallback deterministic aptitude MCQ generator
 */
function generateFallbackAptitudeMCQs(topic, count) {
    const mcqs = [];
    const low = topic.toLowerCase();

    for (let i = 0; i < count; i++) {
        mcqs.push(makeQuestionForTopic(low, i));
    }
    return mcqs;
}

/**
 * Generates a single MCQ for the given topic & index
 */
function makeQuestionForTopic(topic, i) {
    const n = i + 2;
    if (topic.includes("percentage")) {
        const price = 100 + i * 5;
        const discount = 5 + i % 10;
        const finalPrice = ((price) * (1 - discount / 100)).toFixed(2);

        return {
            question: `If an item priced at ₹${price} is discounted by ${discount}%, what is the sale price (rounded to 2 decimals)?`,
            options: [
                finalPrice,
                `${((price) * (1 - (3 + i % 5) / 100)).toFixed(2)}`,
                `${((price) * (1 - (8 + i % 7) / 100)).toFixed(2)}`,
                `${((price) * (1 - (10 + i % 6) / 100)).toFixed(2)}`
            ],
            answer: finalPrice,
            explanation: `To solve this: 1) First calculate the discount amount: ₹${price} × ${discount}% = ₹${(price * discount / 100).toFixed(2)}. 2) Then subtract the discount from original price: ₹${price} - ₹${(price * discount / 100).toFixed(2)} = ₹${finalPrice}. The calculation can also be done directly using: Original Price × (1 - discount%/100).`
        };
    }

    // Generic math question with explanation
    const sum = n + n * 2;
    return {
        question: `What is ${n} + ${n * 2}?`,
        options: [`${sum}`, `${n * n}`, `${n * 3 + 1}`, `${n * 2}`],
        answer: `${sum}`,
        explanation: `To solve this: 1) First identify the values: ${n} and ${n * 2}. 2) Then simply add them: ${n} + ${n * 2} = ${sum}. This is a basic arithmetic addition problem where we add two numbers directly.`
    };
}
