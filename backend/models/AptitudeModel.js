import mongoose from "mongoose";

const AptitudeQuizHistorySchema = new mongoose.Schema({
    topic: { type: String, required: true },
    level: { type: String, default: "easy" },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: () => new Date() }
});

export default mongoose.model("AptitudeQuizHistory", AptitudeQuizHistorySchema);