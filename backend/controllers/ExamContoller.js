import ExamQuizHistory from "../models/ExamModel.js";
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
};

/**
 * Popular Indian competitive exams
 */
const POPULAR_EXAMS = [
    "JEE Main", "JEE Advanced", "NEET", "UPSC Civil Services", "SSC CGL", "SSC CHSL",
    "IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "RRB NTPC", "RRB Group D",
    "GATE", "CAT", "XAT", "CLAT", "NDA", "CDS", "AFCAT", "CTET", "UGC NET",
    "State PSC", "Railway Group C", "Delhi Police Constable", "UP Police Constable",
    "DRDO", "ISRO", "BARC"
];

/**
 * Get updated syllabus information for each exam
 */
const getExamSyllabusInfo = (exam) => {
    const syllabusMap = {
        "JEE Main": "Physics (Mechanics, Thermodynamics, Waves, Optics, Modern Physics), Chemistry (Physical, Inorganic, Organic Chemistry), Mathematics (Algebra, Coordinate Geometry, Calculus, Trigonometry, Statistics)",
        "JEE Advanced": "Advanced Physics (Mechanics, Electrodynamics, Thermodynamics, Optics, Modern Physics), Advanced Chemistry (Physical, Inorganic, Organic), Advanced Mathematics (Algebra, Geometry, Calculus, Probability)",
        "NEET": "Physics (Mechanics, Thermodynamics, Optics, Modern Physics), Chemistry (Physical, Inorganic, Organic), Biology (Botany, Zoology, Human Physiology, Genetics, Ecology)",
        "UPSC Civil Services": "General Studies (History, Geography, Polity, Economy, Science & Technology, Environment, Current Affairs), Essay Writing, Optional Subject",
        "SSC CGL": "General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension, Statistics, Finance & Accounts, Economics & Governance",
        "SSC CHSL": "General Intelligence, English Language, Quantitative Aptitude, General Awareness, Computer Knowledge, Typing Skills",
        "IBPS PO": "Reasoning Ability, Quantitative Aptitude, English Language, General Awareness, Computer Knowledge, Data Analysis & Interpretation",
        "IBPS Clerk": "Reasoning Ability, Numerical Ability, English Language, General Awareness, Computer Knowledge",
        "SBI PO": "Reasoning Ability, Quantitative Aptitude, English Language, General Awareness, Computer Knowledge, Data Analysis",
        "SBI Clerk": "Reasoning Ability, Numerical Ability, English Language, General Awareness, Computer Knowledge",
        "RRB NTPC": "General Awareness, Mathematics, General Intelligence & Reasoning, Current Affairs, Railway-specific Knowledge",
        "RRB Group D": "Mathematics, General Intelligence & Reasoning, General Science, General Awareness, Current Affairs",
        "GATE": "Engineering Mathematics, Core Engineering Subjects (varies by branch), General Aptitude, Technical Knowledge",
        "CAT": "Verbal Ability & Reading Comprehension, Data Interpretation & Logical Reasoning, Quantitative Ability",
        "XAT": "Verbal & Logical Ability, Decision Making, Quantitative Ability, Data Interpretation, General Knowledge",
        "CLAT": "English Language, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques",
        "NDA": "Mathematics, General Ability Test (English, General Knowledge, Physics, Chemistry, General Science, History, Geography)",
        "CDS": "English, General Knowledge, Elementary Mathematics",
        "AFCAT": "General Awareness, Verbal Ability, Numerical Ability, Reasoning & Military Aptitude",
        "CTET": "Child Development & Pedagogy, Language I & II, Mathematics, Environmental Studies, Social Studies/Science",
        "UGC NET": "Teaching & Research Aptitude, Research Methodology, Subject-specific Paper, Higher Education System",
        "State PSC": "General Studies, Current Affairs, State-specific Knowledge, Optional Subjects, Essay Writing",
        "Railway Group C": "General Intelligence & Reasoning, General Awareness, Arithmetic, General Science",
        "Delhi Police Constable": "General Knowledge & Current Affairs, Reasoning, Numerical Ability, Computer Knowledge",
        "UP Police Constable": "General Knowledge, Numerical & Mental Ability, Mental Aptitude, Hindi, English",
        "DRDO": "Engineering/Science subjects, General Aptitude, Technical Knowledge specific to post",
        "ISRO": "Engineering/Science subjects, General Aptitude, Technical Knowledge, Current Affairs",
        "BARC": "Engineering/Science subjects, General Knowledge, Technical Knowledge, Safety Procedures"
    };

    return syllabusMap[exam] || "General Knowledge, Reasoning, Quantitative Aptitude, English, Current Affairs";
};

/**
 * Generate MCQs for exam-based quizzes
 */
export const generateExamMCQs = async (req, res) => {
    try {
        let { exam, topic = "Miscellaneous", count = 10 } = req.body;
        count = Math.min(Math.max(parseInt(count) || 10, 1), 30);

        console.log(`🤖 Generating ${count} MCQs for ${exam} exam on topic: ${topic}`);

        // Validate exam
        if (!exam || exam.trim() === "") {
            console.error('❌ Invalid exam:', exam);
            return res.status(400).json({ error: "Invalid or missing exam name." });
        }

        const examSyllabus = getExamSyllabusInfo(exam);

        // Create comprehensive prompt based on exam and topic
        let prompt;
        if (topic === "Miscellaneous" || topic.toLowerCase() === "miscellaneous") {
            prompt = `You are an expert quiz generator for Indian competitive exams. Generate exactly ${count} multiple-choice questions (4 options each) for the "${exam}" examination.

EXAM SYLLABUS COVERAGE: ${examSyllabus}

Since topic is "Miscellaneous", create a comprehensive mock test that covers the ENTIRE updated syllabus of ${exam} exam. Distribute questions across all major subjects/sections proportionally to simulate the actual exam pattern.

CRITICAL REQUIREMENTS:
1. Follow the EXACT examination pattern and difficulty level of ${exam}
2. Include questions from ALL major subjects mentioned in the syllabus
3. Match the question style, format, and complexity typical of ${exam}
4. Include current affairs and recent developments relevant to ${exam}
5. Ensure questions reflect the latest syllabus updates for ${exam}

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string],
  "answer": string,
  "explanation": string (2-3 sentences explaining the solution approach and why this answer is correct)
}

Where "answer" must exactly equal one of the options. Make questions challenging yet fair, matching the standard of ${exam}.`;
        } else {
            prompt = `You are an expert quiz generator for Indian competitive exams. Generate exactly ${count} multiple-choice questions (4 options each) specifically on the topic "${topic}" for the "${exam}" examination.

EXAM CONTEXT: ${exam} 
EXAM SYLLABUS: ${examSyllabus}
SPECIFIC TOPIC: ${topic}

CRITICAL REQUIREMENTS:
1. ALL questions must be strictly focused on the topic "${topic}"
2. Follow the EXACT examination pattern and difficulty level of ${exam}
3. Match the question style and format typical of ${exam}
4. Ensure questions align with ${exam} syllabus standards for this topic
5. Include practical applications and real-world scenarios when relevant

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string],
  "answer": string,
  "explanation": string (2-3 sentences explaining the solution approach and why this answer is correct)
}

Where "answer" must exactly equal one of the options. Make questions challenging yet fair, matching the standard of ${exam} for the topic ${topic}.`;
        }

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
            mcqs = generateFallbackExamMCQs(exam, topic, count);
            fallback = true;
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            console.error('❌ No valid MCQs generated');
            return res.status(500).json({ error: "Failed to generate MCQs" });
        }

        const finalMcqs = mcqs.slice(0, count);
        console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for ${exam}`);

        res.json({
            mcqs: finalMcqs,
            exam,
            topic,
            fallback,
            generated: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ generateExamMCQs error:", error);
        res.status(500).json({
            error: "Failed to generate MCQs",
            details: error.message
        });
    }
};

/**
 * Save quiz history
 */
export const examSaveHistory = async (req, res) => {
    try {
        const { exam, topic, score, total } = req.body;
        if (!exam || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const entry = await ExamQuizHistory.create({
            exam: exam.trim(),
            topic: topic || "Miscellaneous",
            score: parseInt(score),
            total: parseInt(total)
        });

        res.json({ success: true, id: entry._id, timestamp: entry.timestamp });
    } catch (err) {
        console.error("examSaveHistory error:", err);
        res.status(500).json({ error: "Failed to save history", details: err.message });
    }
};

/**
 * Get recent quiz history
 */
export const examGetHistory = async (req, res) => {
    try {
        const history = await ExamQuizHistory.find().sort({ timestamp: -1 }).limit(50);
        res.json({ history, total: history.length });
    } catch (err) {
        console.error("examGetHistory error:", err);
        res.status(500).json({ error: "Failed to fetch history", details: err.message });
    }
};

/**
 * Fallback deterministic exam MCQ generator
 */
function generateFallbackExamMCQs(exam, topic, count) {
    const mcqs = [];

    for (let i = 0; i < count; i++) {
        mcqs.push(makeQuestionForExam(exam, topic, i));
    }
    return mcqs;
}

/**
 * Generates a single MCQ for the given exam, topic & index
 */
function makeQuestionForExam(exam, topic, i) {
    const questionTemplates = {
        "JEE Main": {
            question: `In a physics problem for JEE Main, if a particle moves with velocity ${10 + i} m/s for ${2 + i} seconds, what is the displacement?`,
            answer: `${(10 + i) * (2 + i)} m`,
            explanation: `Displacement = velocity × time = ${10 + i} × ${2 + i} = ${(10 + i) * (2 + i)} m. This is a basic kinematic equation used in JEE Main physics.`
        },
        "NEET": {
            question: `In human anatomy, which organ system is primarily responsible for gas exchange in the body?`,
            answer: "Respiratory system",
            explanation: "The respiratory system, including lungs and airways, facilitates oxygen intake and carbon dioxide removal through alveolar gas exchange."
        },
        "SSC CGL": {
            question: `If ${15 + i}% of a number is ${(15 + i) * 4}, what is the number?`,
            answer: `${((15 + i) * 4 * 100) / (15 + i)}`,
            explanation: `Let the number be x. Then ${15 + i}% of x = ${(15 + i) * 4}. So (${15 + i}/100) × x = ${(15 + i) * 4}. Therefore x = ${((15 + i) * 4 * 100) / (15 + i)}.`
        },
        "UPSC Civil Services": {
            question: `Which article of the Indian Constitution deals with the Right to Constitutional Remedies?`,
            answer: "Article 32",
            explanation: "Article 32 is known as the 'Heart and Soul' of the Constitution as it guarantees the right to constitutional remedies and empowers citizens to approach the Supreme Court directly."
        }
    };

    const template = questionTemplates[exam] || {
        question: `Sample question ${i + 1} for ${exam} on ${topic}. What is ${5 + i} + ${3 + i}?`,
        answer: `${8 + 2 * i}`,
        explanation: `This is a basic arithmetic problem: ${5 + i} + ${3 + i} = ${8 + 2 * i}. Such questions test fundamental mathematical skills required for ${exam}.`
    };

    return {
        question: template.question,
        options: [
            template.answer,
            `${parseInt(template.answer) + 1}`,
            `${parseInt(template.answer) - 1}`,
            `${parseInt(template.answer) + 2}`
        ].filter((opt, index, arr) => arr.indexOf(opt) === index), // Remove duplicates
        answer: template.answer,
        explanation: template.explanation
    };
}