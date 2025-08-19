import mongoose from "mongoose";

const ExamQuizHistorySchema = new mongoose.Schema({
    exam: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        default: "Miscellaneous",
        trim: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 1
    },
    timestamp: {
        type: Date,
        default: () => new Date()
    }
});

// Add indexes for better query performance
ExamQuizHistorySchema.index({ timestamp: -1 });
ExamQuizHistorySchema.index({ exam: 1 });
ExamQuizHistorySchema.index({ topic: 1 });

// Add virtual for percentage calculation
ExamQuizHistorySchema.virtual('percentage').get(function () {
    return Math.round((this.score / this.total) * 100);
});

// Ensure virtual fields are serialized
ExamQuizHistorySchema.set('toJSON', { virtuals: true });

export default mongoose.model("ExamQuizHistory", ExamQuizHistorySchema);