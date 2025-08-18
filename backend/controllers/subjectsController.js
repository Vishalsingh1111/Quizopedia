import SubjectQuizHistory from "../models/SubjectModel.js";
import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
};

/**
 * Predefined class options
 */
const AVAILABLE_CLASSES = [
    "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Other"
];

/**
 * Common subjects by class level
 */
const COMMON_SUBJECTS = {
    "Class 5": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Environmental Studies"],
    "Class 6": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Sanskrit"],
    "Class 7": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Sanskrit"],
    "Class 8": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Sanskrit"],
    "Class 9": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"],
    "Class 10": ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"],
    "Class 11": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics", "History", "Geography", "Political Science"],
    "Class 12": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics", "History", "Geography", "Political Science"],
    "Other": ["Custom Subject"]
};

/**
 * Generate MCQs for subject-based quizzes (with explanation + logs)
 */
export const generateSubjectMCQs = async (req, res) => {
    try {
        let { className = "Class 10", subject = "Mathematics", chapterName = "", count = 10, customClass = "" } = req.body;
        const questionCount = Math.min(Math.max(parseInt(count) || 10, 1), 20);

        // Handle custom class input
        if (className === "Other" && customClass) {
            className = customClass.trim();
        }

        // Validate inputs
        if (!className || !subject || !chapterName) {
            return res.status(400).json({ error: "Class, subject, and chapter name are required." });
        }

        // Clean inputs
        className = className.trim();
        subject = subject.trim();
        chapterName = chapterName.trim();

        // Prompt with explanation requirement
        const prompt = `Generate exactly ${questionCount} multiple-choice questions (4 options each) for ${className} students on the subject "${subject}" covering the chapter "${chapterName}".

Requirements:
1. Each question should have 4 clear options.
2. Include the correct answer (must exactly match one option).
3. Provide a 2–3 sentence detailed explanation for why that answer is correct.
4. Ensure questions are age-appropriate, curriculum-aligned, and cover conceptual + application aspects.

Format response as JSON array ONLY, example:
[
  {
    "question": "Sample?",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": "Why A is correct in 2–3 sentences."
  }
]`;

        console.log(`🤖 Generating ${questionCount} MCQs for ${className} - ${subject} (${chapterName})`);

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
                    q.explanation = `The correct answer is "${q.answer}" because it is the most accurate option based on the chapter "${chapterName}".`;
                }
                return q;
            });

            console.log(`✅ Successfully generated ${mcqs.length} MCQs`);
        } catch (err) {
            console.error("❌ Gemini generation failed, using fallback:", err.message);
            mcqs = generateFallbackSubjectMCQs(className, subject, chapterName, questionCount);
            fallback = true;
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            return res.status(500).json({ error: "Failed to generate MCQs" });
        }

        res.json({
            mcqs,
            className,
            subject,
            chapterName,
            count: mcqs.length,
            fallback
        });
    } catch (error) {
        console.error("generateSubjectMCQs error:", error);
        res.status(500).json({ error: "Failed to generate MCQs", details: error.message });
    }
};



export const subjectSaveHistory = async (req, res) => {
    try {
        const { className, subject, chapterName, score, total } = req.body;
        if (!className || !subject || !chapterName || score === undefined || total === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const entry = await SubjectQuizHistory.create({
            className: className.trim(),
            subject: subject.trim(),
            chapterName: chapterName.trim(),
            score: parseInt(score),
            total: parseInt(total)
        });

        res.json({ success: true, id: entry._id, timestamp: entry.timestamp });
    } catch (err) {
        console.error("subjectSaveHistory error:", err);
        res.status(500).json({ error: "Failed to save history", details: err.message });
    }
};

/**
 * Get recent quiz history
 */
export const subjectGetHistory = async (req, res) => {
    try {
        const history = await SubjectQuizHistory.find().sort({ timestamp: -1 }).limit(50);
        res.json({ history, total: history.length });
    } catch (err) {
        console.error("subjectGetHistory error:", err);
        res.status(500).json({ error: "Failed to fetch history", details: err.message });
    }
};

/**
 * Get available classes and subjects
 */
export const getClassesAndSubjects = (req, res) => {
    res.json({
        classes: AVAILABLE_CLASSES,
        subjects: COMMON_SUBJECTS
    });
};

/**
 * Fallback deterministic subject MCQ generator with explanation
 */
function generateFallbackSubjectMCQs(className, subject, chapterName, count) {
    const mcqs = [];
    for (let i = 0; i < count; i++) {
        const q = makeQuestionForSubject(className, subject, chapterName, i);
        q.explanation = `The answer "${q.answer}" is correct based on ${chapterName} concepts in ${subject}.`;
        mcqs.push(q);
    }
    return mcqs;
}

/**
 * Generates a single fallback MCQ
 */
function makeQuestionForSubject(className, subject, chapterName, i) {
    const n = i + 2;
    const subjectLower = subject.toLowerCase();

    if (subjectLower.includes("mathematics") || subjectLower.includes("math")) {
        return {
            question: `In ${chapterName}, if we calculate ${n} × ${n + 1}, what is the result?`,
            options: [`${n * (n + 1)}`, `${n * n}`, `${(n + 1) * (n + 1)}`, `${n + (n + 1)}`],
            answer: `${n * (n + 1)}`
        };
    }

    if (subjectLower.includes("science")) {
        const concepts = ["atoms", "molecules", "cells", "energy", "force", "light"];
        const concept = concepts[i % concepts.length];
        return {
            question: `According to ${chapterName}, which of the following is true about ${concept}?`,
            options: [
                `${concept} are the basic building blocks`,
                `${concept} cannot be observed`,
                `${concept} only exist in theory`,
                `${concept} are not important`
            ],
            answer: `${concept} are the basic building blocks`
        };
    }

    return {
        question: `Based on the chapter "${chapterName}" in ${subject}, what is ${n} + ${n}?`,
        options: [`${n + n}`, `${n * n}`, `${n - n}`, `${n * 2 + 1}`],
        answer: `${n + n}`
    };
}
