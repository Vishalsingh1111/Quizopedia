import CurrentAffairsHistory from "../models/currentAffairsModel.js";
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Generate MCQs for current affairs quizzes
 */
export const generateCurrentAffairsMCQs = async (req, res) => {
    try {
        let { timePeriod = "daily", count = 10 } = req.body;
        count = Math.min(Math.max(parseInt(count) || 10, 1), 20);

        // Validate time period
        if (!["daily", "weekly", "monthly"].includes(timePeriod)) {
            console.warn("⚠️ Invalid timePeriod provided, defaulting to daily");
            timePeriod = "daily";
        }

        console.log(`🤖 Generating ${count} MCQs on ${timePeriod} current affairs`);

        // Build Gemini prompt for current affairs MCQs
        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const prompt = `You are a current affairs quiz generator. Today's date is ${currentDate}. Generate exactly ${count} multiple-choice questions (4 options each) based on the latest ${timePeriod} current affairs.

Focus on hot and trending current affairs topics from the last ${timePeriod === "daily" ? "24-48 hours" : timePeriod === "weekly" ? "7 days" : "30 days"
            } that are important for competitive examinations. Include topics from:

- Politics & Government (national and international)
- Economy & Business 
- Sports achievements and events
- Science & Technology breakthroughs
- International relations and diplomacy
- Awards and recognitions
- Important appointments and resignations
- Environmental and climate updates
- Social issues and policy changes
- Defense and security matters

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string], 
  "answer": string,
  "explanation": string (2-3 sentences that explain the current affairs topic)
}

Where "answer" must exactly equal one of the options. Ensure questions are examination-oriented, factual, and cover recent significant events. Make questions challenging but fair for competitive exam preparation.`;

        let mcqs = [];
        let fallback = false;

        try {
            const model = getGeminiModel();
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            console.log("✅ Received response from Gemini API");

            mcqs = extractAndParseJSON(text);
        } catch (err) {
            console.error("❌ Gemini generation failed:", err.message);
            console.log("⚠️ Using fallback MCQ generator");
            mcqs = generateFallbackCurrentAffairsMCQs(timePeriod, count);
            fallback = true;
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            console.error("❌ No valid MCQs generated");
            return res.status(500).json({ error: "Failed to generate current affairs MCQs" });
        }

        const finalMcqs = mcqs.slice(0, count);
        console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for ${timePeriod}`);

        res.json({
            mcqs: finalMcqs,
            timePeriod,
            fallback,
            generated: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ generateCurrentAffairsMCQs error:", error);
        res.status(500).json({
            error: "Failed to generate current affairs MCQs",
            details: error.message,
        });
    }
};

/**
 * Generate current affairs content (non-MCQ format)
 */
export const generateCurrentAffairs = async (req, res) => {
    try {
        let { timePeriod = "daily" } = req.body;

        if (!["daily", "weekly", "monthly"].includes(timePeriod)) {
            console.warn("⚠️ Invalid timePeriod provided, defaulting to daily");
            timePeriod = "daily";
        }

        console.log(`🤖 Generating ${timePeriod} current affairs content`);

        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const prompt = `You are a current affairs content generator. Today's date is ${currentDate}. Generate a comprehensive list of the latest ${timePeriod} current affairs updates.

Focus on hot and trending current affairs from the last ${timePeriod === "daily" ? "24-48 hours" : timePeriod === "weekly" ? "7 days" : "30 days"
            } that are important for competitive examinations. Include updates from:

- Politics & Government (national and international)
- Economy & Business developments
- Sports achievements and major events
- Science & Technology breakthroughs
- International relations and diplomacy
- Awards, recognitions, and honors
- Important appointments and resignations
- Environmental and climate updates
- Social issues and policy changes
- Defense and security matters
- Miscellaneous significant events

Return output as a JSON array of strings only (no extra text). Each string should be a complete, informative sentence about a current affair. Aim for 15-25 comprehensive updates.`;

        let affairs = [];
        let fallback = false;

        try {
            const model = getGeminiModel();
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            console.log("✅ Received response from Gemini API");

            // Extract JSON array safely
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                affairs = JSON.parse(jsonMatch[0]);
            } else {
                affairs = text
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line && !line.startsWith("[") && !line.startsWith("]"))
                    .map((line) => line.replace(/^[-•\d\.]\s*/, "").replace(/^"/, "").replace(/"$/, ""))
                    .filter((line) => line.length > 20);
            }
        } catch (err) {
            console.error("❌ Gemini generation failed:", err.message);
            console.log("⚠️ Using fallback current affairs generator");
            affairs = generateFallbackCurrentAffairs(timePeriod);
            fallback = true;
        }

        if (!Array.isArray(affairs) || !affairs.length) {
            console.error("❌ No valid current affairs generated");
            return res.status(500).json({ error: "Failed to generate current affairs" });
        }

        console.log(`✅ Successfully generated ${affairs.length} current affairs for ${timePeriod}`);

        res.json({
            affairs,
            timePeriod,
            fallback,
            generated: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ generateCurrentAffairs error:", error);
        res.status(500).json({
            error: "Failed to generate current affairs",
            details: error.message,
        });
    }
};

/**
 * Save current affairs quiz history
 */
export const currentAffairsSaveHistory = async (req, res) => {
    try {
        const { timePeriod, score, total } = req.body;
        if (!timePeriod || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const entry = await CurrentAffairsHistory.create({
            timePeriod: timePeriod.trim(),
            score: parseInt(score),
            total: parseInt(total),
        });

        res.json({ success: true, id: entry._id, timestamp: entry.timestamp });
    } catch (err) {
        console.error("❌ saveHistory error:", err);
        res.status(500).json({ error: "Failed to save history", details: err.message });
    }
};

/**
 * Get current affairs quiz history
 */
export const currentAffairsGetHistory = async (req, res) => {
    try {
        const history = await CurrentAffairsHistory.find().sort({ timestamp: -1 }).limit(50);
        res.json({ history, total: history.length });
    } catch (err) {
        console.error("❌ getHistory error:", err);
        res.status(500).json({ error: "Failed to fetch history", details: err.message });
    }
};

/**
 * Fallback deterministic current affairs MCQ generator
 */
function generateFallbackCurrentAffairsMCQs(timePeriod, count) {
    const mcqs = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const sampleQuestions = [
        {
            question: `Which organization recently announced new climate targets for ${currentYear}?`,
            options: ["United Nations", "World Bank", "IMF", "WHO"],
            answer: "United Nations",
            explanation: "The UN frequently sets global climate targets as part of its sustainability agenda.",
        },
        {
            question: `In ${currentMonth} ${currentYear}, which country hosted a major international summit?`,
            options: ["India", "United States", "Germany", "Japan"],
            answer: "India",
            explanation: "India recently hosted a significant international summit highlighting global issues.",
        },
        {
            question: `What is the current GDP growth rate target set by the Indian government for FY ${currentYear}-${(currentYear + 1) % 100}?`,
            options: ["6.5%", "7.0%", "7.5%", "8.0%"],
            answer: "7.0%",
            explanation: "The Government of India set a GDP target of around 7% for sustainable economic growth.",
        },
        {
            question: `Which Indian state recently launched a major renewable energy project in ${currentYear}?`,
            options: ["Rajasthan", "Gujarat", "Tamil Nadu", "Karnataka"],
            answer: "Rajasthan",
            explanation: "Rajasthan has been leading renewable energy expansion with solar and wind projects.",
        },
        {
            question: `The Reserve Bank of India's current repo rate as of ${currentYear} is:`,
            options: ["6.50%", "6.75%", "7.00%", "7.25%"],
            answer: "6.50%",
            explanation: "RBI maintained the repo rate at 6.50% to balance inflation and growth.",
        },
    ];

    for (let i = 0; i < count; i++) {
        mcqs.push(sampleQuestions[i % sampleQuestions.length]);
    }
    return mcqs;
}

/**
 * Fallback current affairs content generator
 */
function generateFallbackCurrentAffairs(timePeriod) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    return [
        `India's GDP growth rate for the fiscal year ${currentYear}-${(currentYear + 1) % 100} is projected at 6.8%.`,
        `The Reserve Bank of India maintained the repo rate at 6.50% in ${currentMonth} ${currentYear}.`,
        `India launched a new satellite mission successfully in ${currentYear}.`,
        `The government announced a ₹10,000 crore digital infrastructure project for rural connectivity.`,
        `India's exports rose 15% YoY, crossing $400 billion in trade.`,
        `The Prime Minister unveiled new clean energy initiatives during a policy speech.`,
    ];
}
