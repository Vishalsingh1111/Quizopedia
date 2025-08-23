import React, { useState, useEffect, useRef } from "react";
import { Clock, Trophy, BookOpen, Star, Users, ChevronDown, Lightbulb, EyeOff, Timer, RefreshCw, Computer, GraduationCap } from 'lucide-react';
import Navbar from "../Navbar";
import Footer from "../Footer";

// API Configuration - Replace with your actual backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3003';

// Actual API function to call your backend
const generateBPSCTREQuiz = async (topic, questionCount) => {
    try {
        const response = await fetch(`${BACKEND_URL}/BpscTre`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic,
                count: questionCount
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        return {
            mcqs: data.mcqs,
            success: true
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

const BPSC_TOPICS = {
    "Current Affairs": [
        "Current Affairs",
        "Computers",
        "General Knowledge",
        "Environment",
        "Government Schemes",
        "Disaster Management"
    ],
    "General Ability": [
        "Logical Reasoning",
        "Analytical Ability",
        "Decision Making and Problem-Solving",
        "Data interpretation- Charts, Graphs, etc (Class X level)",
        "Numbers and their relations (Class X level)",
        "Problems with Data Sufficiency",
        "Orders of magnitude (Class X level)"
    ],
    "Mental Ability": [
        "Data Interpretation",
        "Analytical Ability",
        "Logical Reasoning",
        "Data Sufficiency",
        "Major developments in Information Technology",
        "Decision Making and Problem solving"
    ],
    "Fundamentals of Computer": [
        "Overview of Input and Output devices, pointing devices and scanner",
        "Representation of data (Digital versus Analog, Number system, Decimal, Binary and Hexadecimal)",
        "Introduction to Data processing",
        "Concept of files and its types"
    ],
    "Programming Fundamentals": [
        "C, C++",
        "Java",
        "DotNet",
        "Artificial Intelligence (AI)",
        "Machine learning",
        "Python and BlockChain programming",
        "Principles and programming techniques",
        "Introduction to object-oriented programming (OOPs)",
        "Introduction to Integrated Development Environment and its advantages"
    ],
    "Data Processing": [
        "Word Processing (MS Word)",
        "SpreadSheet Software (MS Excel)",
        "Presentation Software (MS Powerpoint)",
        "DBMS Software (MS Access)"
    ],
    "Data structures and Algorithms": [
        "Algorithms for problem-solving",
        "Abstract data types",
        "Arrays as data structures",
        "Linked list v/s array for storage",
        "Stack and stack operations",
        "Queues",
        "Binary trees, binary search trees",
        "Graphs and their representations",
        "Sorting and searching, symbol table",
        "Data structure using C and C++"
    ],
    "Communication and Network Concepts": [
        "Introduction to computer networks",
        "Introduction: Network layers/Models",
        "Networking Devices",
        "Fundamentals of Mobile Communication"
    ],
    "Network Security": [
        "Protecting the computer from virus and malicious attacks",
        "Introduction to firewalls and its utility",
        "Backup and restoring data",
        "Networking (LAN and WAN)",
        "Security",
        "Ethical Hacking"
    ],
    "Computer Organization and Operation System": [
        "Basic Structure of Computers",
        "Computer Arithmetic Operations",
        "Central Processing Unit and Instructions",
        "Memory Organization",
        "I/O Organization",
        "Operating Systems Overview",
        "Finding and Processing Files",
        "Process Management"
    ],
    "Database Management Systems": [
        "An overview of Database Management",
        "Architecture of Database Management",
        "Relational Database Management",
        "Database Design",
        "Manipulating data",
        "No SQL Database technologies",
        "Selecting Right Database"
    ],
    "System Analysis and Design": [
        "Introduction",
        "Requirement Gathering and Feasibility Analysis",
        "Structured Analysis",
        "Structured Design",
        "Object-Oriented Modelling using UML",
        "Testing",
        "System Implementation and Maintenance",
        "Other Software development approaches"
    ],
    "Internet of Things and its application": [
        "Introduction of Internet Technology and Protocol",
        "LAN",
        "WAN",
        "MAN",
        "Search services/engine",
        "Introduction to online/offline messaging",
        "World wide web browsers",
        "Web publishing",
        "Basic Knowledge HTML.XML.Script",
        "Creation of Maintenance and websites",
        "HTML Interactivity tool",
        "Multimedia and Graphics",
        "Voicemail and video conferencing",
        "Introduction to e-commerce"
    ],
    "Miscellaneous": [
        "Mixed Topics from All Categories"
    ]
};

export default function BPSCTREQuizApp() {
    const [selectedTopic, setSelectedTopic] = useState("");
    const [customTopic, setCustomTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [mcqs, setMcqs] = useState([]);
    const [answered, setAnswered] = useState({});
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiLimitHit, setApiLimitHit] = useState(false);
    const [visibleExplanations, setVisibleExplanations] = useState({});

    // Timer related states
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [timerMinutes, setTimerMinutes] = useState(15);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [oneMinuteWarningShown, setOneMinuteWarningShown] = useState(false);

    const timerIntervalRef = useRef(null);

    // Timer effect
    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;

                    if (newTime === 60 && !oneMinuteWarningShown) {
                        setOneMinuteWarningShown(true);
                        alert('⚠️ Only 1 minute remaining!');
                    }

                    if (newTime <= 0) {
                        handleTimeUp();
                        return 0;
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [timerActive, timeLeft, oneMinuteWarningShown]);

    const handleTimeUp = () => {
        if (!submitted) {
            setTimerActive(false);
            alert('⏰ Time\'s up! Quiz auto-submitted.');
            handleSubmit(true);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft <= 60) return 'text-red-600 animate-pulse';
        if (timeLeft <= 300) return 'text-yellow-600';
        return 'text-green-600';
    };

    const fetchMCQs = async () => {
        const topic = selectedTopic === "Other" ? customTopic : selectedTopic;

        if (!topic.trim()) {
            alert("Please select a topic");
            return;
        }

        setLoading(true);
        setApiLimitHit(false);

        // Reset quiz state
        setScore(0);
        setSubmitted(false);
        setAnswered({});
        setMcqs([]);
        setVisibleExplanations({});
        setOneMinuteWarningShown(false);

        try {
            // Call the actual API instead of mock function
            const response = await generateBPSCTREQuiz(topic, questionCount);

            setMcqs(response.mcqs);

            // Start timer if enabled
            if (timerEnabled) {
                const totalSeconds = timerMinutes * 60;
                setTimeLeft(totalSeconds);
                setTimerActive(true);
                // alert(`✅ Quiz started with ${timerMinutes} minute timer!`);
                // } else {
                //     alert(`✅ ${response.mcqs.length} questions ready for ${topic}!`);
                // }
            }

        } catch (error) {
            console.error('Error fetching MCQs:', error);

            if (error.message === 'API_LIMIT_HIT') {
                setApiLimitHit(true);
            } else {
                setApiLimitHit(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const regenerateQuiz = () => {
        setApiLimitHit(false);
        fetchMCQs();
    };

    const checkAnswer = (questionIndex, selectedOption) => {
        if (submitted) return;

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

    const handleSubmit = async (isAutoSubmit = false) => {
        if (!isAutoSubmit && Object.keys(answered).length < mcqs.length) {
            const unanswered = mcqs.length - Object.keys(answered).length;
            if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
                return;
            }
        }

        setTimerActive(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        const finalScore = calculateFinalScore();
        setScore(finalScore);
        setSubmitted(true);

    };

    const resetQuiz = () => {
        setTimerActive(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        setMcqs([]);
        setSelectedTopic("");
        setCustomTopic("");
        setAnswered({});
        setScore(0);
        setSubmitted(false);
        setVisibleExplanations({});
        setTimeLeft(0);
        setOneMinuteWarningShown(false);
        setApiLimitHit(false);
    };

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
        if (!submitted) {
            const isSelected = answered[questionIndex]?.selectedOption === option;
            if (isSelected) {
                return "bg-blue-50 dark:bg-blue-700 dark:text-white border-blue-400 border-2 text-blue-700";
            }
            return "bg-white dark:bg-transparent dark:border-white/10 hover:bg-purple-100 dark:hover:bg-purple-600 dark:text-white transition-colors border border-gray-200";
        }

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
            <div className="min-h-screen pt-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                <Computer className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">BPSC TRE</h1>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold dark:text-purple-300 text-purple-600 mb-4">Computer Teacher Preparation Quiz</h2>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Comprehensive preparation for BPSC TRE Computer Teacher Examination 📚
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
                                        Select Main Topic
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedTopic}
                                            onChange={(e) => setSelectedTopic(e.target.value)}
                                            className="w-full appearance-none border border-gray-200 dark:border-white/20 
                       rounded-lg px-4 py-3 pr-8 transition-all bg-white dark:bg-black 
                       text-gray-900 dark:text-white"
                                            disabled={loading}
                                        >
                                            <option value="">Choose a topic...</option>
                                            {Object.keys(BPSC_TOPICS).map((topic) => (
                                                <option key={topic} value={topic}>{topic}</option>
                                            ))}
                                            <option value="Other">Other (Custom Topic)</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Custom Topic Input */}
                                {selectedTopic === "Other" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Enter Custom Topic
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Advanced Database Concepts, Cloud Computing"
                                            value={customTopic}
                                            onChange={(e) => setCustomTopic(e.target.value)}
                                            className="w-full border border-gray-200 dark:border-white/20 rounded-lg px-4 py-3 
                     transition-all bg-white dark:bg-black text-gray-900 dark:text-white 
                     placeholder-gray-400 dark:placeholder-gray-500"
                                            disabled={loading}
                                        />
                                    </div>
                                )}

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
                                            <option value={25}>25 Questions</option>
                                            <option value={30}>30 Questions</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Timer Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="timer-enabled"
                                            checked={timerEnabled}
                                            onChange={(e) => setTimerEnabled(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            disabled={loading}
                                        />
                                        <label htmlFor="timer-enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                                            <Timer className="w-4 h-4" />
                                            <span>Enable Timer (Recommended for Exam Practice)</span>
                                        </label>
                                    </div>

                                    {timerEnabled && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Timer Duration (Minutes)
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={timerMinutes}
                                                    onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                                                    className="w-full appearance-none border border-gray-200 dark:border-white/20 
                               rounded-lg px-4 py-3 pr-8 transition-all bg-white dark:bg-black 
                               text-gray-900 dark:text-white"
                                                    disabled={loading}
                                                >
                                                    <option value={10}>10 Minutes</option>
                                                    <option value={15}>15 Minutes</option>
                                                    <option value={20}>20 Minutes</option>
                                                    <option value={30}>30 Minutes</option>
                                                    <option value={45}>45 Minutes</option>
                                                    <option value={60}>60 Minutes</option>
                                                    <option value={90}>90 Minutes</option>
                                                    <option value={120}>120 Minutes</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Start Button */}
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        onClick={fetchMCQs}
                                        disabled={loading || !selectedTopic || (selectedTopic === "Other" && !customTopic.trim())}
                                    >
                                        <GraduationCap className="w-5 h-5" />
                                        <span>{loading ? "Generating Quiz..." : "Start BPSC TRE Quiz"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Questions */}
                    {mcqs.length > 0 && (
                        <div className="space-y-6">
                            {/* Quiz Header with Timer */}
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                            🎯
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {selectedTopic === "Other" ? customTopic : selectedTopic}
                                            </h2>
                                            <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                                                Covers all subtopics
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                                <Users className="w-4 h-4" />
                                                <span>
                                                    Progress: {Object.keys(answered).length}/{mcqs.length} answered
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center space-x-4">

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
                                                {timerEnabled && timerActive && (
                                                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                                                        <Clock className={`w-5 h-5 ${getTimerColor()}`} />
                                                        <div className="text-center">
                                                            <p className={`text-xl font-bold ${getTimerColor()}`}>
                                                                {formatTime(timeLeft)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Time Left</p>
                                                        </div>
                                                    </div>
                                                )}
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
                                        onClick={() => handleSubmit(false)}
                                    >
                                        <Trophy className="w-6 h-6" />
                                        <span>Submit Quiz</span>
                                    </button>
                                </div>
                            )}

                            {/* Final Results */}
                            {submitted && (
                                <div className="dark:text-white overflow-hidden p-12 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                                        🎉
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">BPSC TRE Quiz Completed!</h2>
                                    <div className={`text-6xl font-bold mb-6 ${getScoreColor(score, mcqs.length)}`}>
                                        {score}/{mcqs.length}
                                    </div>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                        You scored {Math.round((score / mcqs.length) * 100)}% in {selectedTopic === "Other" ? customTopic : selectedTopic}
                                    </p>
                                    <p className="text-lg text-purple-600 dark:text-purple-400 mb-4 font-medium">
                                        All subtopics covered
                                    </p>
                                    {timerEnabled && (
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                            {timeLeft > 0
                                                ? `Completed with ${formatTime(timeLeft)} remaining!`
                                                : 'Time expired - Quiz auto-submitted!'}
                                        </p>
                                    )}
                                    <div className="mb-8">
                                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                                            Performance Analysis:
                                        </p>
                                        <div className="flex justify-center space-x-6 text-sm">
                                            <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-lg">
                                                <span className="text-green-600 font-bold">✅ Correct: {score}</span>
                                            </div>
                                            <div className="bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-lg">
                                                <span className="text-red-600 font-bold">❌ Incorrect: {mcqs.length - score}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                                        Review the explanations above to strengthen your preparation for BPSC TRE!
                                    </p>
                                    <button
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors flex items-center space-x-3 mx-auto"
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