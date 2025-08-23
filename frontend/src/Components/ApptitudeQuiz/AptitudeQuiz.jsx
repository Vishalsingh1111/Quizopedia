import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trophy, BookOpen, Star, Users, ChevronDown, Lightbulb, EyeOff, RefreshCw } from 'lucide-react';
import Navbar from "../Navbar";
import Footer from "../Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3003';

const TOPICS = [
    "Percentage",
    "Ratio",
    "Distance",
    "Permutation",
    "Profit and loss",
    "Average",
    "Compound interest",
    "Probability",
    "Time and work",
    "Numeral system",
    "Problem on Ages",
    "Algebra",
    "Boats and Streams",
    "Greatest common divisor",
    "Problems on Trains",
    "Geometry",
    "Mensuration",
    "Mixtures and alligation",
    "Pipes and Cistern",
    "Simple Interest",
    "Calendar and clocks",
    "Logical reasoning",
    "Area",
    "Partnership"
];

export default function AptitudeQuiz() {
    const [topic, setTopic] = useState(TOPICS[0]);
    const [level, setLevel] = useState("easy");
    const [questionCount, setQuestionCount] = useState(10);
    const [mcqs, setMcqs] = useState([]);
    const [answered, setAnswered] = useState({});
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiLimitHit, setApiLimitHit] = useState(false);
    const [visibleExplanations, setVisibleExplanations] = useState({});

    useEffect(() => {
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`);
            console.log('✅ Backend connected:', response.data);
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            toast.error('Backend connection failed. Please check if the server is running.');
        }
    };

    const toggleExplanation = (questionIndex) => {
        setVisibleExplanations(prev => ({
            ...prev,
            [questionIndex]: !prev[questionIndex]
        }));
    };

    const fetchMCQs = async () => {
        setLoading(true);
        setApiLimitHit(false);
        const loadingToast = toast.loading("🤖 AI is generating aptitude quiz...");

        // Reset quiz state
        setMcqs([]);
        setAnswered({});
        setSubmitted(false);
        setScore(0);
        setVisibleExplanations({});

        try {
            const response = await axios.post(`${BACKEND_URL}/generate-aptitude-mcqs`, {
                topic,
                level,
                count: questionCount
            }, {
                // timeout: 150000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('MCQs response:', response.data);

            if (response.data && Array.isArray(response.data.mcqs) && response.data.mcqs.length) {
                setMcqs(response.data.mcqs);
                toast.dismiss(loadingToast);
                toast.success(`✅ ${response.data.mcqs.length} aptitude questions ready!`);
            } else {
                throw new Error('No questions received from server');
            }

        } catch (error) {
            console.error('Error fetching MCQs:', error);
            toast.dismiss(loadingToast);

            // Check if it's an API limit error
            if (error.response?.status === 503 && error.response?.data?.error === "API_LIMIT_HIT") {
                setApiLimitHit(true);
                toast.error('API limit reached. Please try again later.');
            } else {
                let errorMessage = 'Failed to generate aptitude quiz';
                if (error.response) {
                    errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
                } else if (error.request) {
                    errorMessage = 'Cannot connect to server. Please check if backend is running.';
                } else {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const regenerateQuiz = () => {
        setApiLimitHit(false);
        fetchMCQs();
    };

    const checkAnswer = (qIndex, option) => {
        if (submitted) return;
        setAnswered(prev => ({ ...prev, [qIndex]: { selectedOption: option } }));
    };

    const calculateFinalScore = () => {
        let final = 0;
        const newAnswered = { ...answered };

        mcqs.forEach((q, idx) => {
            if (newAnswered[idx]?.selectedOption) {
                const correct = newAnswered[idx].selectedOption === q.answer;
                if (correct) final++;
                newAnswered[idx] = {
                    ...newAnswered[idx],
                    correct
                };
            }
        });

        setAnswered(newAnswered);
        return final;
    };

    const handleSubmit = async () => {
        if (!mcqs.length) return;
        const answeredCount = Object.keys(answered).length;
        if (answeredCount < mcqs.length) {
            const unanswered = mcqs.length - answeredCount;
            if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) return;
        }

        const finalScore = calculateFinalScore();
        setScore(finalScore);
        setSubmitted(true);

        toast.success(`🎉 Quiz completed! Score: ${finalScore}/${mcqs.length}`, { duration: 3500 });
    };

    const resetQuiz = () => {
        setMcqs([]);
        setAnswered({});
        setScore(0);
        setSubmitted(false);
        setTopic(TOPICS[0]);
        setLevel("easy");
        setQuestionCount(10);
        setVisibleExplanations({});
        setApiLimitHit(false);
    };

    const getScoreColor = (scoreVal, total) => {
        const pct = (scoreVal / total) * 100;
        if (pct >= 80) return 'text-green-600';
        if (pct >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getOptionClass = (questionIndex, option) => {
        // Before submission - show only selected state
        if (!submitted) {
            const isSelected = answered[questionIndex]?.selectedOption === option;
            if (isSelected) {
                return "bg-blue-50 dark:bg-blue-700 dark:text-white border-blue-400 border-2 text-blue-700";
            }
            return "bg-white dark:bg-transparent dark:border-white/10 hover:bg-purple-50 dark:hover:bg-purple-400 transition-colors border border-gray-200";
        }

        // After submission - show correct/incorrect states
        const isSelected = answered[questionIndex]?.selectedOption === option;
        const isCorrect = mcqs[questionIndex].answer === option;
        const userWasCorrect = answered[questionIndex]?.correct;

        if (isSelected && userWasCorrect) return "bg-green-100 text-green-700 dark:bg-green-600 dark:text-white border-green-400 border-2 dark:border-white/20";
        if (isSelected && !userWasCorrect) return "bg-red-100 dark:bg-red-600 dark:text-white text-red-700 border-red-400 border-2 dark:border-white/20";
        if (isCorrect && !isSelected) return "bg-green-50 dark:bg-green-600 dark:text-white border-green-400 border-2 text-green-600 dark:border-white/20";
        return "bg-gray-50 border border-gray-200 dark:bg-transparent dark:border-white/20";
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                <Toaster position="top-center" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                🧠
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">Aptitude Quiz Generator</h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Generate aptitude MCQs on various topics with different difficulty levels ⭐
                        </p>
                    </div>

                    {/* API Limit Hit Message */}
                    {apiLimitHit && mcqs.length === 0 && (
                        <div className="bg-transparent dark:text-white overflow-hidden p-12 mb-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                                ⚠️
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">API Hit Limit</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                                The API Hit Limit. Please Try Again
                            </p>
                            <button
                                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center space-x-3 mx-auto"
                                onClick={regenerateQuiz}
                                disabled={loading}
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>{loading ? "Generating..." : "Regenerate"}</span>
                            </button>
                        </div>
                    )}

                    {/* Quiz Setup Form */}
                    {mcqs.length === 0 && !apiLimitHit && (
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                            <div className="space-y-6">
                                {/* Topic Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Aptitude Topic
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="w-full appearance-none border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 pr-8 
                         transition-all bg-white dark:bg-black text-gray-900 dark:text-white"
                                            disabled={loading}
                                        >
                                            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Difficulty Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Difficulty Level
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            className={`px-4 py-2 rounded-lg transition-colors ${level === 'easy'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                            onClick={() => setLevel('easy')}
                                            disabled={loading}
                                        >
                                            Easy
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-lg transition-colors ${level === 'medium'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                            onClick={() => setLevel('medium')}
                                            disabled={loading}
                                        >
                                            Medium
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-lg transition-colors ${level === 'hard'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                            onClick={() => setLevel('hard')}
                                            disabled={loading}
                                        >
                                            Hard
                                        </button>
                                    </div>
                                </div>

                                {/* Question Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Number of Questions
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={questionCount}
                                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                            className="w-full appearance-none border border-gray-200 dark:border-white/20 
                       rounded-lg px-4 py-3 pr-8 transition-all bg-white dark:bg-black 
                       text-gray-900 dark:text-white"
                                            disabled={loading}
                                        >
                                            <option value={5}>5 Questions</option>
                                            <option value={10}>10 Questions</option>
                                            <option value={15}>15 Questions</option>
                                            <option value={20}>20 Questions</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Start Quiz Button */}
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        onClick={fetchMCQs}
                                        disabled={loading}
                                    >
                                        <Trophy className="w-5 h-5" />
                                        <span>{loading ? "Generating..." : "Start Quiz"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Questions */}
                    {mcqs.length > 0 && (
                        <div id="quiz-print-area" className="space-y-6">
                            {/* Quiz Header */}
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                            🎯
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Quiz: {topic} — {level}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                                <Users className="w-4 h-4" />
                                                <span>
                                                    Progress: {Object.keys(answered).length}/{mcqs.length} questions answered
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex">
                                        <button
                                            className="hover:bg-purple-600 bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg mr-4 print:hidden"
                                            onClick={() => window.print()}
                                        >
                                            🖨️ Print Quiz
                                        </button>
                                        {submitted ? (
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                                <div>
                                                    <p className={`text-3xl font-bold ${getScoreColor(score, mcqs.length)}`}>
                                                        {score}/{mcqs.length}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-400">Final Score</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-600">?</p>
                                                <p className="text-gray-500 dark:text-gray-400">Score Hidden</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Questions */}
                            {mcqs.map((q, qi) => (
                                <div
                                    key={qi}
                                    className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            {qi + 1}. {q.question}
                                        </h3>
                                    </div>

                                    <div className="grid gap-3">
                                        {q.options.map((opt, oi) => (
                                            <button
                                                key={oi}
                                                className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 ${getOptionClass(qi, opt)}`}
                                                onClick={() => checkAnswer(qi, opt)}
                                                disabled={submitted}
                                            >
                                                <span className="font-bold text-sm bg-gray-100 dark:text-black px-2 py-1 rounded mr-3">
                                                    {String.fromCharCode(65 + oi)}
                                                </span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Feedback and Explanation Section */}
                                    {submitted && (
                                        <div className="mt-6 space-y-4">
                                            {/* Answer Status */}
                                            {answered[qi]?.selectedOption ? (
                                                <div
                                                    className={`p-4 rounded-lg ${answered[qi].correct
                                                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                                                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                                        }`}
                                                >
                                                    <p className={`font-bold mb-2 ${answered[qi].correct ? "text-green-600" : "text-red-600"}`}>
                                                        {answered[qi].correct ? "✅ Correct!" : "❌ Incorrect"}
                                                    </p>
                                                    {!answered[qi].correct && (
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                            Your answer: <span className="font-medium text-red-600">{answered[qi].selectedOption}</span>
                                                            <br />
                                                            Correct answer: <span className="font-medium text-green-600">{q.answer}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                                                    <p className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">⚠️ Not attempted</p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Correct answer: <span className="font-medium text-green-600">{q.answer}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {/* Explanation Toggle Section */}
                                            {q.explanation && (
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => toggleExplanation(qi)}
                                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors border border-blue-200 dark:border-blue-700"
                                                    >
                                                        {visibleExplanations[qi] ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Lightbulb className="w-4 h-4" />
                                                        )}
                                                        <span className="font-medium text-sm">
                                                            {visibleExplanations[qi] ? "Hide Solution" : "Show Solution"}
                                                        </span>
                                                    </button>

                                                    {visibleExplanations[qi] && (
                                                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 animate-in slide-in-from-top-2 duration-200">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="flex-shrink-0">
                                                                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">💡 Solution</h4>
                                                                    <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
                                                                        {q.explanation}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Submit Button */}
                            {!submitted && (
                                <div className="text-center">
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors flex items-center space-x-3 mx-auto"
                                        onClick={handleSubmit}
                                    >
                                        <Trophy className="w-6 h-6" />
                                        <span>Submit Quiz</span>
                                    </button>
                                </div>
                            )}

                            {/* Final Results */}
                            {submitted && (
                                <div className="bg-transparent dark:text-white overflow-hidden p-12 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                                        🎉
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
                                    <div className={`text-6xl font-bold mb-6 ${getScoreColor(score, mcqs.length)}`}>
                                        {score}/{mcqs.length}
                                    </div>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                        You scored {Math.round((score / mcqs.length) * 100)}%
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                                        Review the explanations above to learn from your mistakes and improve your knowledge!
                                    </p>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors flex items-center space-x-3 mx-auto"
                                        onClick={resetQuiz}
                                    >
                                        <BookOpen className="w-6 h-6" />
                                        <span>Start New Quiz</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}