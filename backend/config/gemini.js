import { GoogleGenerativeAI } from "@google/generative-ai";

let model;

export const initGemini = () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        console.log("✅ Google Gemini AI initialized");
    } catch (error) {
        console.error("❌ Error initializing Gemini AI:", error);
    }
};

export const getGeminiModel = () => model;
