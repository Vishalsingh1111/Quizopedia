import QuizHistory from "../models/QuizHistory.js";
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
        console.error('❌ MCQ Generation Error:', error.message);

        // Enhanced error logging
        if (error.message.includes('fetch failed')) {
            console.error('🌐 Network/API connectivity issue detected');
        } else if (error.message.includes('timeout')) {
            console.error('⏱️ API request timeout');
        } else if (error.message.includes('API_KEY')) {
            console.error('🔑 API key configuration issue');
        }

        // Improved fallback with multiple sample questions
        const fallbackMcqs = [
            {
                question: `What is a fundamental concept in ${topic}?`,
                options: ["Basic Principle", "Advanced Theory", "Unrelated Concept", "Random Option"],
                answer: "Basic Principle",
                explanation: `Basic principles form the foundation of ${topic}. Understanding these core concepts is essential for mastering more advanced topics in this subject area.`
            },
            {
                question: `Which approach is commonly used in ${topic}?`,
                options: ["Standard Method", "Obsolete Technique", "Irrelevant Process", "Wrong Approach"],
                answer: "Standard Method",
                explanation: `Standard methods are widely adopted in ${topic} because they have been proven effective through extensive research and practical application.`
            },
            {
                question: `What is an important consideration when studying ${topic}?`,
                options: ["Key Factor", "Minor Detail", "Unimportant Element", "Irrelevant Aspect"],
                answer: "Key Factor",
                explanation: `Key factors play a crucial role in ${topic} and must be carefully considered to achieve successful outcomes and deep understanding.`
            },
            {
                question: `How does ${topic} relate to practical applications?`,
                options: ["Direct Application", "No Connection", "Theoretical Only", "Abstract Concept"],
                answer: "Direct Application",
                explanation: `${topic} has direct practical applications in many real-world scenarios, making it valuable for both academic study and professional development.`
            },
            {
                question: `What skill is essential for mastering ${topic}?`,
                options: ["Critical Thinking", "Memorization Only", "Random Guessing", "Passive Reading"],
                answer: "Critical Thinking",
                explanation: `Critical thinking is essential for mastering ${topic} as it enables deeper understanding, problem-solving, and the ability to apply knowledge in new situations.`
            }
        ];

        // Return appropriate number of fallback questions
        const selectedFallbacks = fallbackMcqs.slice(0, questionCount);

        res.json({
            mcqs: selectedFallbacks,
            topic,
            count: selectedFallbacks.length,
            fallback: true,
            error: "Using sample questions due to API limitations",
            errorDetails: error.message
        });
    }
};

export const saveHistory = async (req, res) => {
    try {
        const { topic, score, total } = req.body;

        if (!topic || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing required fields: topic, score, total" });
        }

        // Additional validation
        const parsedScore = parseInt(score);
        const parsedTotal = parseInt(total);

        if (isNaN(parsedScore) || isNaN(parsedTotal) || parsedScore < 0 || parsedTotal < 1) {
            return res.status(400).json({ error: "Invalid score or total values" });
        }

        if (parsedScore > parsedTotal) {
            return res.status(400).json({ error: "Score cannot be greater than total" });
        }

        const historyEntry = await QuizHistory.create({
            topic: topic.trim(),
            score: parsedScore,
            total: parsedTotal
        });

        console.log(`✅ Quiz history saved: ${topic} - ${parsedScore}/${parsedTotal}`);

        res.json({
            success: true,
            id: historyEntry._id,
            timestamp: historyEntry.timestamp
        });
    } catch (error) {
        console.error('❌ Save History Error:', error);
        res.status(500).json({
            error: "Failed to save quiz history",
            details: error.message
        });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await QuizHistory.find()
            .sort({ timestamp: -1 })
            .limit(50);

        console.log(`✅ Retrieved ${history.length} quiz history entries`);

        res.json({
            history,
            total: history.length
        });
    } catch (error) {
        console.error('❌ Get History Error:', error);
        res.status(500).json({
            error: "Failed to fetch quiz history",
            details: error.message
        });
    }
};




