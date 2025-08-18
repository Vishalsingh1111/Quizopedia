import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Clock, Trophy, BookOpen, Star, Users, ChevronDown, Lightbulb, EyeOff } from 'lucide-react';
import Navbar from "../Navbar";
import Footer from "../Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3003';

export default function QuizApp() {
    const [topic, setTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [mcqs, setMcqs] = useState([]);
    const [answered, setAnswered] = useState({});
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [quizHistory, setQuizHistory] = useState([]);
    // New state for tracking which explanations are visible
    const [visibleExplanations, setVisibleExplanations] = useState({});

    // Test backend connection on component mount
    useEffect(() => {
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`);
            console.log('✅ Backend connected:', response.data);
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            toast.error('Using Testing API And It Hit Limit, Please Try Again');
        }
    };

    const fetchMCQs = async () => {
        if (!topic.trim()) {
            return toast.error("Please enter a topic");
        }

        setLoading(true);
        const loadingToast = toast.loading("🤖 AI is generating your quiz ...");

        // Reset quiz state
        setScore(0);
        setSubmitted(false);
        setAnswered({});
        setMcqs([]);
        setVisibleExplanations({}); // Reset explanation visibility

        try {
            console.log('Requesting MCQs for topic:', topic);

            const response = await axios.post(`${BACKEND_URL}/generate-mcqs`, {
                topic: topic.trim(),
                count: questionCount,
            }, {
                timeout: 90000, // 90 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('MCQs response:', response.data);

            if (response.data.mcqs && response.data.mcqs.length > 0) {
                setMcqs(response.data.mcqs);
                toast.dismiss(loadingToast);

                if (response.data.fallback) {
                    toast('Using sample questions due to API limitations', {
                        icon: '⚠️',
                        duration: 3000
                    });
                } else {
                    toast.success(`✅ ${response.data.mcqs.length} questions ready !`);
                }
            } else {
                throw new Error('No questions received from server');
            }

        } catch (error) {
            console.error('Error fetching MCQs:', error);
            toast.dismiss(loadingToast);

            let errorMessage = 'Failed to generate quiz';
            if (error.response) {
                errorMessage = error.response.data?.error || errorMessage;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please check if backend is running.';
            } else {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = (questionIndex, selectedOption) => {
        // Only prevent changes AFTER submission
        if (submitted) return;

        // Allow changing the selected option before submission
        setAnswered((prev) => ({
            ...prev,
            [questionIndex]: { selectedOption },
        }));
    };

    const calculateFinalScore = () => {
        let finalScore = 0;
        Object.keys(answered).forEach((questionIndex) => {
            const correct = mcqs[questionIndex].answer === answered[questionIndex].selectedOption;
            if (correct) {
                finalScore++;
            }
            // Update answered state with correct/incorrect info
            setAnswered((prev) => ({
                ...prev,
                [questionIndex]: {
                    ...prev[questionIndex],
                    correct
                }
            }));
        });
        return finalScore;
    };

    const handleSubmit = async () => {
        if (Object.keys(answered).length < mcqs.length) {
            const unanswered = mcqs.length - Object.keys(answered).length;
            if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
                return;
            }
        }

        // Calculate final score
        const finalScore = calculateFinalScore();
        setScore(finalScore);
        setSubmitted(true);

        toast.success(`🎉 Quiz completed! Score: ${finalScore}/${mcqs.length}`, {
            duration: 4000
        });

        // Save to history
        try {
            await axios.post(`${BACKEND_URL}/save-history`, {
                topic,
                score: finalScore,
                total: mcqs.length,
            });
            console.log('Quiz history saved successfully');
        } catch (error) {
            console.error('Failed to save quiz history:', error);
            toast.error('Failed to save quiz history');
        }
    };

    const fetchQuizHistory = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/quiz-history`);
            setQuizHistory(response.data.history || []);
            setShowHistory(true);
        } catch (error) {
            console.error('Error fetching quiz history:', error);
            toast.error('Failed to fetch quiz history');
        }
    };

    const resetQuiz = () => {
        setMcqs([]);
        setTopic("");
        setAnswered({});
        setScore(0);
        setSubmitted(false);
        setShowHistory(false);
        setVisibleExplanations({});
    };

    // Function to toggle explanation visibility
    const toggleExplanation = (questionIndex) => {
        setVisibleExplanations(prev => ({
            ...prev,
            [questionIndex]: !prev[questionIndex]
        }));
    };

    const getScoreColor = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getOptionClass = (questionIndex, option) => {
        // Before submission - show only selected state
        if (!submitted) {
            const isSelected = answered[questionIndex]?.selectedOption === option;
            if (isSelected) {
                return "bg-blue-50 dark:bg-blue-700 dark:text-white border-blue-400 border-2 text-blue-700";
            }
            return "bg-white dark:bg-transparent dark:border-white/10 hover:bg-purple-100 dark:hover:bg-purple-600 dark:text-white transition-colors border border-gray-200";
        }

        // After submission - show correct/incorrect states
        const isSelected = answered[questionIndex]?.selectedOption === option;
        const isCorrect = mcqs[questionIndex].answer === option;
        const userWasCorrect = answered[questionIndex]?.correct;

        if (isSelected && userWasCorrect) return "bg-green-100 text-green-700 dark:bg-green-600 dark:border-white/10 dark:text-white border-green-400 border-2";
        if (isSelected && !userWasCorrect) return "bg-red-100 dark:bg-red-600 dark:text-white dark:border-white/10 text-red-700 border-red-400 border-2";
        if (isCorrect && !isSelected) return "bg-green-50 dark:bg-green-600 dark:text-white dark:border-white/10 border-green-400 border-2 text-green-600";
        return "bg-gray-50 border border-gray-200 dark:border-white/10 dark:bg-transparent";
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600"><Toaster position="top-center" /></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                🧠
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">AI Quiz Generator</h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Generate custom quizzes on any topic using AI ⭐
                        </p>
                    </div>

                    {/* Quiz Setup Form */}
                    {mcqs.length === 0 && !showHistory && (
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                            <div className="space-y-6">
                                {/* Topic Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Quiz Topic
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, World History, Biology, Mathematics"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 
                         transition-all bg-white dark:bg-black text-gray-900 dark:text-white 
                         placeholder-gray-400 dark:placeholder-gray-500"
                                        disabled={loading}
                                    />
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

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        onClick={fetchMCQs}
                                        disabled={loading || !topic.trim()}
                                    >
                                        <Trophy className="w-5 h-5" />
                                        <span>{loading ? "Generating..." : "Start Quiz"}</span>
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

                    {/* Quiz History */}
                    {showHistory && (
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl dark:text-white font-bold text-gray-900">Quiz History</h2>
                                <button
                                    className="bg-gray-100 dark:text-white dark:bg-red-500 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
                                    onClick={() => setShowHistory(false)}
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {quizHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
                                        📊
                                    </div>
                                    <p className="text-gray-500 dark:text-white">No quiz history found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {quizHistory.map((entry, index) => (
                                        <div key={entry._id || index} className="border border-gray-100 dark:border-white/20 rounded-lg p-6 hover:shadow-sm dark:bg-black">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-white">
                                                        <BookOpen className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold dark:text-white text-gray-900 text-lg">{entry.topic}</h3>
                                                        <p className="text-sm dark:text-gray-100 text-gray-500">
                                                            {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                                            {new Date(entry.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className={`font-bold text-xl ${getScoreColor(entry.score, entry.total)}`}>
                                                            {entry.score}/{entry.total}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {Math.round((entry.score / entry.total) * 100)}% Score
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                                Quiz: {topic}
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
                            {mcqs.map((question, questionIndex) => (
                                <div
                                    key={questionIndex}
                                    className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            {questionIndex + 1}. {question.question}
                                        </h3>
                                    </div>

                                    <div className="grid gap-3">
                                        {question.options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-200 ${getOptionClass(questionIndex, option)}`}
                                                onClick={() => checkAnswer(questionIndex, option)}
                                                disabled={submitted}
                                            >
                                                <span className="font-bold text-sm bg-gray-100 dark:text-black px-2 py-1 rounded mr-3">
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </span>
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Enhanced Feedback with Toggle Explanations */}
                                    {submitted && (
                                        <div className="mt-6 space-y-4">
                                            {/* Answer Status */}
                                            {answered[questionIndex] ? (
                                                <div
                                                    className={`p-4 rounded-lg ${answered[questionIndex].correct
                                                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                                                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                                        }`}
                                                >
                                                    <p
                                                        className={`font-bold mb-2 ${answered[questionIndex].correct ? "text-green-600" : "text-red-600"
                                                            }`}
                                                    >
                                                        {answered[questionIndex].correct ? "✅ Correct!" : "❌ Incorrect"}
                                                    </p>
                                                    {!answered[questionIndex].correct && (
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                            Your answer: <span className="font-medium text-red-600">{answered[questionIndex].selectedOption}</span>
                                                            <br />
                                                            Correct answer: <span className="font-medium text-green-600">{question.answer}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                                                    <p className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">⚠️ Not attempted</p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Correct answer: <span className="font-medium text-green-600">{question.answer}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {/* Toggle Explanation Section */}
                                            {question.explanation && (
                                                <div className="space-y-3">
                                                    {/* Toggle Button */}
                                                    <button
                                                        onClick={() => toggleExplanation(questionIndex)}
                                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors border border-blue-200 dark:border-blue-700"
                                                    >
                                                        {visibleExplanations[questionIndex] ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Lightbulb className="w-4 h-4" />
                                                        )}
                                                        <span className="font-medium text-sm">
                                                            {visibleExplanations[questionIndex] ? "Hide Explanation" : "Show Explanation"}
                                                        </span>
                                                    </button>

                                                    {/* Explanation Content */}
                                                    {visibleExplanations[questionIndex] && (
                                                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 animate-in slide-in-from-top-2 duration-200">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="flex-shrink-0">
                                                                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">💡 Explanation</h4>
                                                                    <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
                                                                        {question.explanation}
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
                                <div className=" dark:text-white overflow-hidden p-12 text-center">
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

