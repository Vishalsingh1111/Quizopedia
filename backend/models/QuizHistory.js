import mongoose from "mongoose";

const QuizHistorySchema = new mongoose.Schema({
    topic: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("QuizHistory", QuizHistorySchema);
