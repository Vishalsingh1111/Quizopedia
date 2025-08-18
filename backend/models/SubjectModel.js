import mongoose from "mongoose";

const SubjectQuizHistorySchema = new mongoose.Schema({
    className: { type: String, required: true },
    subject: { type: String, required: true },
    chapterName: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: () => new Date() }
});

export default mongoose.model("SubjectQuizHistory", SubjectQuizHistorySchema);