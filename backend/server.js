import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import { initGemini } from "./config/gemini.js";

// Load env variables
dotenv.config();

initGemini();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",                 // local development
        "http://127.0.0.1:3000",                 // local dev alt
        "https://quizopedia-ai.onrender.com" // your deployed frontend
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
app.use("/", quizRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});

// Start server

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Google API Key configured: ${process.env.GOOGLE_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🗄️  MongoDB URI configured: ${process.env.MONGO_URI ? 'Yes' : 'No'}`);
});
