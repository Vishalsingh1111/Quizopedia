import GeneralKnowledgeQuizHistory from "../models/GeneralKnowledgeModel.js";
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
};

/**
 * Available difficulty levels
 */
const DIFFICULTY_LEVELS = [
    "Easy", "Medium", "Hard"
];

/**
 * Available quiz topics
 */
const QUIZ_TOPICS = [
    "Geography",
    "History of India",
    "Science",
    "History",
    "Indian economy",
    "Literature",
    "Technology",
    "Constitution",
    "Sports",
    "Art and culture",
    "Chemistry",
    "Indian culture",
    "International airports of India",
    "Which planet has the most moons?",
    "World",
    "Miscellaneous",
    "Other"
];

/**
 * Generate MCQs for general knowledge quizzes (with explanation + logs)
 */
export const generateGeneralKnowledgeMCQs = async (req, res) => {
    try {
        let { level = "Easy", topic = "Geography", count = 10, customTopic = "" } = req.body;
        const questionCount = Math.min(Math.max(parseInt(count) || 10, 1), 20);

        // Handle custom topic input
        if (topic === "Other" && customTopic) {
            topic = customTopic.trim();
        }

        // Validate inputs
        if (!level || !topic) {
            return res.status(400).json({ error: "Difficulty level and topic are required." });
        }

        // Clean inputs
        level = level.trim();
        topic = topic.trim();

        // Create comprehensive prompt based on topic
        let prompt = "";

        if (topic.toLowerCase() === "miscellaneous") {
            // For miscellaneous, include questions from all topics
            prompt = `Generate exactly ${questionCount} multiple-choice questions (4 options each) for a ${level} level General Knowledge quiz covering MIXED topics from:

Topics to include (mix randomly):
- Geography (countries, capitals, rivers, mountains, climate)
- History of India (ancient, medieval, modern periods, freedom struggle, rulers)
- Science (physics, chemistry, biology, space, inventions)
- World History (civilizations, wars, important events)
- Indian Economy (GDP, industries, agriculture, banking, finance)
- Literature (famous authors, books, poetry, Nobel prizes)
- Technology (computers, internet, AI, innovations, gadgets)
- Indian Constitution (articles, amendments, fundamental rights, governance)
- Sports (Olympics, cricket, football, records, tournaments)
- Art and Culture (music, dance, festivals, traditions, monuments)
- Chemistry (elements, compounds, reactions, periodic table)
- Indian Culture (festivals, languages, customs, religions)
- International Airports of India (major airports, IATA codes, cities)
- Astronomy and Space (planets, moons, solar system, space missions)
- World Affairs (countries, currencies, international organizations, current affairs)

Difficulty Level: ${level}
- Easy: Basic facts, well-known information
- Medium: Requires some knowledge, moderate difficulty
- Hard: Advanced knowledge, complex concepts

Requirements:
1. Mix questions from different topics randomly
2. Each question should have 4 clear, distinct options
3. Include the correct answer (must exactly match one option)
4. Provide a detailed 2-3 sentence explanation for why that answer is correct
5. Questions should be factual, accurate, and well-researched
6. Avoid ambiguous or controversial topics

Format response as JSON array ONLY:
[
  {
    "question": "Sample question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Detailed explanation in 2-3 sentences why this answer is correct."
  }
]`;
        } else {
            // For specific topics
            const topicPrompts = {
                "Geography": `Generate exactly ${questionCount} multiple-choice questions about Geography including countries, capitals, rivers, mountains, oceans, climate zones, natural phenomena, and geographical features.`,

                "History of India": `Generate exactly ${questionCount} multiple-choice questions about Indian History covering ancient civilizations, medieval period, Mughal empire, British colonial rule, freedom struggle, independence movement, and post-independence India.`,

                "Science": `Generate exactly ${questionCount} multiple-choice questions about Science covering physics (motion, energy, light), chemistry (elements, compounds), biology (human body, plants, animals), and general scientific principles.`,

                "History": `Generate exactly ${questionCount} multiple-choice questions about World History including ancient civilizations, medieval periods, world wars, important historical events, famous rulers, and significant historical developments.`,

                "Indian economy": `Generate exactly ${questionCount} multiple-choice questions about Indian Economy covering GDP, major industries, agriculture, banking sector, stock markets, economic policies, five-year plans, and economic indicators.`,

                "Literature": `Generate exactly ${questionCount} multiple-choice questions about Literature including famous authors, classic books, poetry, Nobel Prize winners in literature, literary movements, and important literary works from India and around the world.`,

                "Technology": `Generate exactly ${questionCount} multiple-choice questions about Technology covering computers, internet, artificial intelligence, software, hardware, programming languages, tech companies, innovations, and digital technologies.`,

                "Constitution": `Generate exactly ${questionCount} multiple-choice questions about the Indian Constitution including fundamental rights, directive principles, constitutional articles, amendments, government structure, judiciary, and constitutional provisions.`,

                "Sports": `Generate exactly ${questionCount} multiple-choice questions about Sports covering Olympics, cricket, football, tennis, athletics, sports records, famous athletes, tournaments, and sporting events from India and worldwide.`,

                "Art and culture": `Generate exactly ${questionCount} multiple-choice questions about Art and Culture including music, dance forms, paintings, sculptures, cultural traditions, festivals, art movements, and artistic heritage from India and around the world.`,

                "Chemistry": `Generate exactly ${questionCount} multiple-choice questions about Chemistry covering periodic table, elements, compounds, chemical reactions, acids and bases, organic chemistry, and important chemical processes.`,

                "Indian culture": `Generate exactly ${questionCount} multiple-choice questions about Indian Culture including festivals, traditions, languages, religions, customs, folk arts, classical dance forms, music, and cultural practices across different states.`,

                "International airports of India": `Generate exactly ${questionCount} multiple-choice questions about International Airports of India including airport names, IATA codes, cities they serve, runway details, and important facts about major Indian airports.`,

                "Which planet has the most moons?": `Generate exactly ${questionCount} multiple-choice questions about Astronomy and Space covering planets, moons, solar system, space missions, astronauts, space agencies, galaxies, and astronomical phenomena.`,

                "World": `Generate exactly ${questionCount} multiple-choice questions about World Affairs including countries and capitals, currencies, international organizations, world leaders, global events, and important world facts.`
            };

            const topicPrompt = topicPrompts[topic] || `Generate exactly ${questionCount} multiple-choice questions about ${topic}.`;

            prompt = `${topicPrompt}

Difficulty Level: ${level}
- Easy: Basic facts, commonly known information
- Medium: Requires good general knowledge, moderate difficulty  
- Hard: Advanced knowledge, detailed facts, complex concepts

Requirements:
1. Each question should have 4 clear, distinct options
2. Include the correct answer (must exactly match one option)
3. Provide a detailed 2-3 sentence explanation for why that answer is correct
4. Questions should be factual, accurate, and well-researched
5. Make questions appropriate for the ${level} difficulty level
6. Avoid ambiguous or overly controversial topics

Format response as JSON array ONLY:
[
  {
    "question": "Sample question about ${topic}?",
    "options": ["Option A", "Option B", "Option C", "Option D"], 
    "answer": "Option A",
    "explanation": "Detailed explanation in 2-3 sentences why this answer is correct."
  }
]`;
        }

        console.log(`🧠 Generating ${questionCount} General Knowledge MCQs for ${level} level - ${topic}`);

        let mcqs = [];
        let fallback = false;

        try {
            const model = getGeminiModel();
            const result = await Promise.race([
                model.generateContent(prompt),
                new Promise((_, reject) => setTimeout(() => reject(new Error("API timeout after 90s")), 90000))
            ]);

            const text = (await result.response).text();
            console.log("✅ Received response from Gemini API");

            mcqs = extractAndParseJSON(text);

            // Validate and enforce explanation
            mcqs = mcqs.slice(0, questionCount).map((q, idx) => {
                if (!q.explanation || !q.explanation.trim()) {
                    q.explanation = `The correct answer is "${q.answer}" based on factual information about ${topic} at ${level} difficulty level.`;
                }
                return q;
            });

            console.log(`✅ Successfully generated ${mcqs.length} General Knowledge MCQs`);
        } catch (err) {
            console.error("❌ Gemini generation failed, using fallback:", err.message);
            mcqs = generateFallbackGeneralKnowledgeMCQs(level, topic, questionCount);
            fallback = true;
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            return res.status(500).json({ error: "Failed to generate MCQs" });
        }

        res.json({
            mcqs,
            level,
            topic,
            count: mcqs.length,
            fallback
        });
    } catch (error) {
        console.error("generateGeneralKnowledgeMCQs error:", error);
        res.status(500).json({ error: "Failed to generate MCQs", details: error.message });
    }
};

/**
 * Save quiz history
 */
export const generalKnowledgeSaveHistory = async (req, res) => {
    try {
        const { level, topic, score, total } = req.body;
        if (!level || !topic || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const entry = await GeneralKnowledgeQuizHistory.create({
            level: level.trim(),
            topic: topic.trim(),
            score: parseInt(score),
            total: parseInt(total)
        });

        res.json({ success: true, id: entry._id, timestamp: entry.timestamp });
    } catch (err) {
        console.error("generalKnowledgeSaveHistory error:", err);
        res.status(500).json({ error: "Failed to save history", details: err.message });
    }
};

/**
 * Get recent quiz history
 */
export const generalKnowledgeGetHistory = async (req, res) => {
    try {
        const history = await GeneralKnowledgeQuizHistory.find().sort({ timestamp: -1 }).limit(50);
        res.json({ history, total: history.length });
    } catch (err) {
        console.error("generalKnowledgeGetHistory error:", err);
        res.status(500).json({ error: "Failed to fetch history", details: err.message });
    }
};

/**
 * Get available difficulty levels and topics
 */
export const getDifficultyLevelsAndTopics = (req, res) => {
    res.json({
        difficultyLevels: DIFFICULTY_LEVELS,
        topics: QUIZ_TOPICS
    });
};

/**
 * Fallback deterministic general knowledge MCQ generator with explanation
 */
function generateFallbackGeneralKnowledgeMCQs(level, topic, count) {
    const mcqs = [];
    for (let i = 0; i < count; i++) {
        const q = makeQuestionForGeneralKnowledge(level, topic, i);
        q.explanation = `The answer "${q.answer}" is correct based on general knowledge facts about ${topic} at ${level} difficulty level.`;
        mcqs.push(q);
    }
    return mcqs;
}

/**
 * Generates a single fallback general knowledge MCQ
 */
function makeQuestionForGeneralKnowledge(level, topic, i) {
    const topicLower = topic.toLowerCase();

    // Geography questions
    if (topicLower.includes("geography")) {
        const countries = ["India", "China", "USA", "Russia", "Brazil"];
        const capitals = ["New Delhi", "Beijing", "Washington DC", "Moscow", "Brasilia"];
        const country = countries[i % countries.length];
        const capital = capitals[i % capitals.length];

        return {
            question: `What is the capital of ${country}?`,
            options: [capital, "London", "Paris", "Tokyo"],
            answer: capital
        };
    }

    // Science questions  
    if (topicLower.includes("science")) {
        const facts = [
            { q: "What is the chemical symbol for water?", a: "H2O", opts: ["H2O", "CO2", "O2", "NaCl"] },
            { q: "How many bones are in the adult human body?", a: "206", opts: ["206", "205", "207", "200"] },
            { q: "What planet is known as the Red Planet?", a: "Mars", opts: ["Mars", "Venus", "Jupiter", "Saturn"] }
        ];
        const fact = facts[i % facts.length];
        return {
            question: fact.q,
            options: fact.opts,
            answer: fact.a
        };
    }

    // History questions
    if (topicLower.includes("history")) {
        const events = [
            { q: "In which year did India gain independence?", a: "1947", opts: ["1947", "1946", "1948", "1950"] },
            { q: "Who was the first Prime Minister of India?", a: "Jawaharlal Nehru", opts: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"] }
        ];
        const event = events[i % events.length];
        return {
            question: event.q,
            options: event.opts,
            answer: event.a
        };
    }

    // Sports questions
    if (topicLower.includes("sports")) {
        const sports = [
            { q: "How many players are there in a cricket team?", a: "11", opts: ["11", "10", "12", "9"] },
            { q: "Which country hosted the 2020 Olympics?", a: "Japan", opts: ["Japan", "China", "Brazil", "UK"] }
        ];
        const sport = sports[i % sports.length];
        return {
            question: sport.q,
            options: sport.opts,
            answer: sport.a
        };
    }

    // Default general question
    const num = (i + 1) * 2;
    return {
        question: `What is ${num} multiplied by 2?`,
        options: [`${num * 2}`, `${num + 2}`, `${num * 3}`, `${num - 2}`],
        answer: `${num * 2}`
    };
}