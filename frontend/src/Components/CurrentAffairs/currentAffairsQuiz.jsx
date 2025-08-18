import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Clock, Trophy, BookOpen, Star, Users, ChevronDown, Newspaper, Globe, Calendar, RefreshCw, Lightbulb, EyeOff } from 'lucide-react';
import Navbar from "../Navbar";
import Footer from "../Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3003';

const TIME_PERIODS = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
];

export default function CurrentAffairs() {
    // Mode toggle state
    const [mode, setMode] = useState("mcq"); // "mcq" or "reader"

    // Common states
    const [timePeriod, setTimePeriod] = useState("daily");
    const [loading, setLoading] = useState(false);

    // MCQ specific states
    const [questionCount, setQuestionCount] = useState(10);
    const [mcqs, setMcqs] = useState([]);
    const [answered, setAnswered] = useState({});
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [quizHistory, setQuizHistory] = useState([]);
    const [visibleExplanations, setVisibleExplanations] = useState({});

    // Reader specific states
    const [affairs, setAffairs] = useState([]);

    useEffect(() => {
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            const r = await axios.get(`${BACKEND_URL}/health`);
            console.log('✅ Backend connected:', r.data);
        } catch (e) {
            console.error('❌ Backend connection failed:', e);
            toast.error('Backend connection failed. Ensure server is running.');
        }
    };

    const toggleExplanation = (questionIndex) => {
        setVisibleExplanations(prev => ({
            ...prev,
            [questionIndex]: !prev[questionIndex]
        }));
    };

    // Reset states when mode changes
    const handleModeToggle = (newMode) => {
        setMode(newMode);
        resetAllStates();
    };

    const resetAllStates = () => {
        // Reset MCQ states
        setMcqs([]);
        setAnswered({});
        setScore(0);
        setSubmitted(false);
        setShowHistory(false);
        setQuizHistory([]);

        // Reset Reader states
        setAffairs([]);

        // Reset common states
        setTimePeriod("daily");
        setQuestionCount(10);
        setLoading(false);
    };

    // MCQ Functions
    const fetchMCQs = async () => {
        setLoading(true);
        const loadingToast = toast.loading("📰 Generating current affairs quiz...");
        setMcqs([]);
        setAnswered({});
        setSubmitted(false);
        setScore(0);

        try {
            const resp = await axios.post(`${BACKEND_URL}/generate-current-affairs-mcqs`, {
                timePeriod,
                count: questionCount
            }, { timeout: 90000 });

            if (resp.data && Array.isArray(resp.data.mcqs) && resp.data.mcqs.length) {
                setMcqs(resp.data.mcqs);
                toast.dismiss(loadingToast);
                if (resp.data.fallback) {
                    toast('⚠️ Using sample current affairs questions (no AI configured)', { duration: 3500 });
                } else {
                    toast.success(`✅ ${resp.data.mcqs.length} current affairs questions ready!`);
                }
            } else {
                throw new Error('No questions returned');
            }
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            let msg = 'Failed to generate quiz';
            if (error.response?.data?.error) msg = error.response.data.error;
            else if (error.message) msg = error.message;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
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

        try {
            await axios.post(`${BACKEND_URL}/current-affairs-save-history`, {
                timePeriod,
                score: finalScore,
                total: mcqs.length
            });
        } catch (err) {
            console.error('Failed to save history', err);
            toast.error('Failed to save quiz history');
        }
    };

    const fetchQuizHistory = async () => {
        try {
            const resp = await axios.get(`${BACKEND_URL}/current-affairs-quiz-history`);
            setQuizHistory(resp.data.history || []);
            setShowHistory(true);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch quiz history');
        }
    };

    // Reader Functions
    const fetchCurrentAffairs = async () => {
        setLoading(true);
        const loadingToast = toast.loading("📰 Fetching latest current affairs...");
        setAffairs([]);

        try {
            const resp = await axios.post(`${BACKEND_URL}/generate-current-affairs`, {
                timePeriod
            }, { timeout: 90000 });

            if (resp.data && Array.isArray(resp.data.affairs) && resp.data.affairs.length) {
                setAffairs(resp.data.affairs);
                toast.dismiss(loadingToast);
                if (resp.data.fallback) {
                    toast('⚠️ Using sample current affairs (no AI configured)', { duration: 3500 });
                } else {
                    toast.success(`✅ ${resp.data.affairs.length} current affairs updates loaded!`);
                }
            } else {
                throw new Error('No current affairs returned');
            }
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            let msg = 'Failed to fetch current affairs';
            if (error.response?.data?.error) msg = error.response.data.error;
            else if (error.message) msg = error.message;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Utility Functions
    const getScoreColor = (scoreVal, total) => {
        const pct = (scoreVal / total) * 100;
        if (pct >= 80) return 'text-purple-600';
        if (pct >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getOptionClass = (questionIndex, option) => {
        // Before submission - show only selected state
        if (!submitted) {
            const isSelected = answered[questionIndex]?.selectedOption === option;
            if (isSelected) {
                return "bg-blue-50 dark:bg-blue-500 dark:text-white border-blue-400 border-2 text-blue-700 dark:border-white/20";
            }
            return "bg-white dark:bg-transparent dark:border-white/20 hover:bg-purple-50 dark:hover:bg-purple-400 transition-colors border border-gray-200";
        }

        // After submission - show correct/incorrect states
        const isSelected = answered[questionIndex]?.selectedOption === option;
        const isCorrect = mcqs[questionIndex].answer === option;
        const userWasCorrect = !!answered[questionIndex]?.correct;


        if (isSelected && userWasCorrect) return "bg-green-100 text-green-700 dark:bg-green-600 dark:text-white border-green-400 border-2 dark:border-white/20";
        if (isSelected && !userWasCorrect) return "bg-red-100 dark:bg-red-600 dark:text-white text-red-700 border-red-400 border-2 dark:border-white/20";
        if (isCorrect && !isSelected) return "bg-green-50 dark:bg-green-600 dark:text-white border-green-400 border-2 text-green-600 dark:border-white/20";
        return "bg-gray-50 border border-gray-200 dark:bg-transparent dark:border-white/20";
    };

    const getTimePeriodLabel = (period) => {
        return TIME_PERIODS.find(p => p.value === period)?.label || period;
    };

    const getTimePeriodIcon = (period) => {
        switch (period) {
            case 'daily': return <Calendar className="w-5 h-5" />;
            case 'weekly': return <BookOpen className="w-5 h-5" />;
            case 'monthly': return <Globe className="w-5 h-5" />;
            default: return <Newspaper className="w-5 h-5" />;
        }
    };

    const resetMCQQuiz = () => {
        setMcqs([]);
        setAnswered({});
        setScore(0);
        setSubmitted(false);
        setShowHistory(false);
        setTimePeriod("daily");
        setQuestionCount(10);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                <Toaster position="top-center" />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Mode Toggle */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                {mode === "mcq" ? "📰" : "🌍"}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">
                                Current Affairs {mode === "mcq" ? "MCQ" : "Reader"}
                            </h1>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white dark:bg-white/10 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-1 inline-flex">
                                <button
                                    onClick={() => handleModeToggle("mcq")}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${mode === "mcq"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                >
                                    <Newspaper className="w-5 h-5" />
                                    <span>MCQ Quiz</span>
                                </button>
                                <button
                                    onClick={() => handleModeToggle("reader")}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${mode === "reader"
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        }`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span>Reader Mode</span>
                                </button>
                            </div>
                        </div>

                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            {mode === "mcq"
                                ? "Test your knowledge with MCQs covering politics, economics, sports, technology, and global events."
                                : "Read comprehensive current affairs updates in an easy-to-digest format."
                            }
                        </p>
                    </div>

                    {/* MCQ Mode */}
                    {mode === "mcq" && (
                        <>
                            {/* MCQ Setup */}
                            {mcqs.length === 0 && !showHistory && (
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Time Period</label>
                                            <div className="relative">
                                                <select
                                                    value={timePeriod}
                                                    onChange={(e) => setTimePeriod(e.target.value)}
                                                    className="w-full appearance-none border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 pr-8 
                         transition-all bg-white dark:bg-black text-gray-900 dark:text-white"
                                                    disabled={loading}
                                                >
                                                    {TIME_PERIODS.map(period => (
                                                        <option key={period.value} value={period.value}>
                                                            {period.label} Current Affairs
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Number of Questions</label>
                                            <div className="relative">
                                                <select
                                                    value={questionCount}
                                                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                                    className="w-full appearance-none border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 pr-8 
                         transition-all bg-white dark:bg-black text-gray-900 dark:text-white"
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

                                        <div className="flex gap-4">
                                            <button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                                onClick={fetchMCQs}
                                                disabled={loading}
                                            >
                                                <Newspaper className="w-5 h-5" />
                                                <span>{loading ? "Generating..." : "Start Current Affairs Quiz"}</span>
                                            </button>

                                            <button
                                                className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                                                onClick={fetchQuizHistory}
                                            >
                                                <Clock className="w-5 h-5" />
                                                <span>History</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MCQ History */}
                            {showHistory && (
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl dark:text-white font-bold text-gray-900">Current Affairs Quiz History</h2>
                                        <button
                                            className="bg-gray-100 dark:text-white dark:bg-red-500 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
                                            onClick={() => setShowHistory(false)}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>

                                    {quizHistory.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">📊</div>
                                            <p className="text-gray-500 dark:text-white">No quiz history found</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {quizHistory.map((entry, i) => (
                                                <div key={entry._id || i} className="border border-gray-100 dark:border-white/20 rounded-lg p-6 hover:shadow-sm dark:bg-black transition-shadow">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white">
                                                                <Globe className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold dark:text-white text-gray-900 text-lg">{getTimePeriodLabel(entry.timePeriod)} Current Affairs</h3>
                                                                <p className="text-sm dark:text-gray-100 text-gray-500">
                                                                    {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="flex items-center space-x-2">
                                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                <span className={`font-bold text-xl ${getScoreColor(entry.score, entry.total)}`}>{entry.score}/{entry.total}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">{Math.round((entry.score / entry.total) * 100)}% Score</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* MCQ Questions */}
                            {mcqs.length > 0 && (
                                <div id="quiz-print-area" className="space-y-6">
                                    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">🎯</div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTimePeriodLabel(timePeriod)} Current Affairs Quiz</h2>
                                                    <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2"><Users className="w-4 h-4" /><span>Progress: {Object.keys(answered).length}/{mcqs.length} answered</span></p>
                                                </div>
                                            </div>

                                            <div className="flex text-right">
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
                                                            <p className={`text-3xl font-bold ${getScoreColor(score, mcqs.length)}`}>{score}/{mcqs.length}</p>
                                                            <p className="text-gray-500 dark:text-gray-400">Final Score</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-3xl font-bold text-blue-600">?</p>
                                                        <p className="text-gray-500 dark:text-gray-400">Score Hidden</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {mcqs.map((q, qi) => (
                                        <div key={qi} className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{qi + 1}. {q.question}</h3>
                                            </div>

                                            <div className="grid gap-3">
                                                {q.options.map((opt, oi) => (
                                                    <button
                                                        key={oi}
                                                        className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 ${getOptionClass(qi, opt)}`}
                                                        onClick={() => checkAnswer(qi, opt)}
                                                        disabled={submitted}
                                                    >
                                                        <span className="font-bold text-sm bg-gray-100 dark:text-black px-2 py-1 rounded mr-3">{String.fromCharCode(65 + oi)}</span>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Add Explanation Toggle and Content */}
                                            {/* {submitted && q.explanation && (
                                                <div className="mt-6 space-y-4">
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
                                            )} */}




                                            {submitted && (
                                                <div className="mt-6 space-y-4">
                                                    {/* Answer Status */}
                                                    {answered[qi] ? (
                                                        <div
                                                            className={`p-4 rounded-lg ${answered[qi].correct
                                                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                                                                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                                                }`}
                                                        >
                                                            <p
                                                                className={`font-bold mb-2 ${answered[qi].correct ? "text-green-600" : "text-red-600"
                                                                    }`}
                                                            >
                                                                {answered[qi].correct ? "✅ Correct!" : "❌ Incorrect"}
                                                            </p>
                                                            {!answered[qi].correct && (
                                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                                    Your answer:{" "}
                                                                    <span className="font-medium text-red-600">
                                                                        {answered[qi].selectedOption}
                                                                    </span>
                                                                    <br />
                                                                    Correct answer:{" "}
                                                                    <span className="font-medium text-green-600">
                                                                        {q.answer}
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                                                            <p className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                                                                ⚠️ Not attempted
                                                            </p>
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                                Correct answer:{" "}
                                                                <span className="font-medium text-green-600">{q.answer}</span>
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Toggle Explanation Section */}
                                                    {q.explanation && (
                                                        <div className="space-y-3">
                                                            {/* Toggle Button */}
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
                                                                    {visibleExplanations[qi] ? "Hide Explanation" : "Show Explanation"}
                                                                </span>
                                                            </button>

                                                            {/* Explanation Content */}
                                                            {visibleExplanations[qi] && (
                                                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 animate-in slide-in-from-top-2 duration-200">
                                                                    <div className="flex items-start space-x-3">
                                                                        <div className="flex-shrink-0">
                                                                            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
                                                                                💡 Explanation
                                                                            </h4>
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

                                    {!submitted && (
                                        <div className="text-center">
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors flex items-center space-x-3 mx-auto" onClick={handleSubmit}>
                                                <Trophy className="w-6 h-6" />
                                                <span>Submit Quiz</span>
                                            </button>
                                        </div>
                                    )}

                                    {submitted && (
                                        <div className="bg-transparent dark:text-white overflow-hidden p-12 text-center">
                                            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                                                🎉
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
                                            <div className={`text-6xl font-bold mb-6 ${getScoreColor(score, mcqs.length)}`}>{score}/{mcqs.length}</div>
                                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">You scored {Math.round((score / mcqs.length) * 100)}%</p>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors flex items-center space-x-3 mx-auto" onClick={resetMCQQuiz}>
                                                <BookOpen className="w-6 h-6" />
                                                <span>Start New Quiz</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Reader Mode */}
                    {mode === "reader" && (
                        <>
                            {/* Reader Setup */}
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Time Period</label>
                                        <div className="relative">
                                            <select
                                                value={timePeriod}
                                                onChange={(e) => setTimePeriod(e.target.value)}
                                                className="w-full appearance-none border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 pr-8 
                     transition-all bg-white dark:bg-black text-gray-900 dark:text-white"
                                                disabled={loading}
                                            >
                                                {TIME_PERIODS.map(period => (
                                                    <option key={period.value} value={period.value}>
                                                        {period.label} Current Affairs
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                            onClick={fetchCurrentAffairs}
                                            disabled={loading}
                                        >
                                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : getTimePeriodIcon(timePeriod)}
                                            <span>{loading ? "Fetching..." : `Get ${getTimePeriodLabel(timePeriod)} Updates`}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Reader Content */}
                            {affairs.length > 0 && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">📰</div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTimePeriodLabel(timePeriod)} Current Affairs</h2>
                                                <p className="text-gray-600 dark:text-gray-400">Latest updates • {affairs.length} items</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {affairs.map((affair, index) => (
                                                <div key={index} className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-400 pl-6 pr-4 py-4 rounded-r-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">{affair}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="dark:text-white overflow-hidden p-8 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">✅</div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated!</h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">You're now up to date with the latest {timePeriod} current affairs.</p>
                                        <button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                                            onClick={fetchCurrentAffairs}
                                            disabled={loading}
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            <span>Refresh Updates</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Reader Empty State */}
                            {affairs.length === 0 && !loading && (
                                <div className="bg-transparent  dark:text-white overflow-hidden p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-100 shadow dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 text-5xl mx-auto mb-6">📰</div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Current Affairs Loaded</h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Click the button above to fetch the latest current affairs updates.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}