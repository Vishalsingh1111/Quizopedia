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
            console.log("⚠️ API limit reached - returning error");
            fallback = true;
        }

        if (fallback || !Array.isArray(mcqs) || !mcqs.length) {
            console.error("❌ No valid MCQs generated or API limit reached");
            return res.status(429).json({
                error: "API limit reached",
                fallback: true,
                message: "The API has hit its limit. Please try again later."
            });
        }

        const finalMcqs = mcqs.slice(0, count);
        console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for ${timePeriod}`);

        res.json({
            mcqs: finalMcqs,
            timePeriod,
            fallback: false,
            generated: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ generateCurrentAffairsMCQs error:", error);
        res.status(500).json({
            error: "Failed to generate current affairs MCQs",
            fallback: true,
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
            console.log("⚠️ API limit reached - returning error");
            fallback = true;
        }

        if (fallback || !Array.isArray(affairs) || !affairs.length) {
            console.error("❌ No valid current affairs generated or API limit reached");
            return res.status(429).json({
                error: "API limit reached",
                fallback: true,
                message: "The API has hit its limit. Please try again later."
            });
        }

        console.log(`✅ Successfully generated ${affairs.length} current affairs for ${timePeriod}`);

        res.json({
            affairs,
            timePeriod,
            fallback: false,
            generated: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ generateCurrentAffairs error:", error);
        res.status(500).json({
            error: "Failed to generate current affairs",
            fallback: true,
            details: error.message,
        });
    }
};