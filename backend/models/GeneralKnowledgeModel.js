import mongoose from "mongoose";

const GeneralKnowledgeQuizHistorySchema = new mongoose.Schema({
    level: { type: String, required: true, enum: ["Easy", "Medium", "Hard"] },
    topic: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    timestamp: { type: Date, default: () => new Date() }
});

export default mongoose.model("GeneralKnowledgeQuizHistory", GeneralKnowledgeQuizHistorySchema);
