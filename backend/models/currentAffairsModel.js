import mongoose from "mongoose";

const CurrentAffairsHistorySchema = new mongoose.Schema({
    timePeriod: {
        type: String,
        required: true,
        enum: ["daily", "weekly", "monthly"],
        default: "daily"
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

// Add indexes for better performance
CurrentAffairsHistorySchema.index({ timestamp: -1 });
CurrentAffairsHistorySchema.index({ timePeriod: 1 });

export default mongoose.model("CurrentAffairsHistory", CurrentAffairsHistorySchema);