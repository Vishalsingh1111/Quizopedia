import React, { useState } from "react";
import { Heart, Star, Lightbulb, MessageCircle, Zap, Users, Send, Smile, Frown, Meh } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";

const FEEDBACK_TYPES = [
    {
        id: 'general',
        title: 'General Feedback',
        description: 'Share your overall experience',
        icon: <MessageCircle className="w-8 h-8" />,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'feature',
        title: 'Feature Request',
        description: 'Suggest new features or improvements',
        icon: <Lightbulb className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'improvement',
        title: 'Improvement Idea',
        description: 'How can we make things better?',
        icon: <Zap className="w-8 h-8" />,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'compliment',
        title: 'Compliment',
        description: 'Tell us what you love',
        icon: <Heart className="w-8 h-8" />,
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'complaint',
        title: 'Complaint',
        description: 'Let us know what bothers you',
        icon: <Frown className="w-8 h-8" />,
        color: 'from-red-500 to-pink-500'
    },
    {
        id: 'community',
        title: 'Community Ideas',
        description: 'Suggestions for user community',
        icon: <Users className="w-8 h-8" />,
        color: 'from-indigo-500 to-purple-500'
    }
];

const SATISFACTION_LEVELS = [
    { value: 5, label: 'Very Satisfied', icon: <Smile className="w-6 h-6" />, color: 'text-green-500' },
    { value: 4, label: 'Satisfied', icon: <Smile className="w-6 h-6" />, color: 'text-green-400' },
    { value: 3, label: 'Neutral', icon: <Meh className="w-6 h-6" />, color: 'text-yellow-500' },
    { value: 2, label: 'Unsatisfied', icon: <Frown className="w-6 h-6" />, color: 'text-orange-500' },
    { value: 1, label: 'Very Unsatisfied', icon: <Frown className="w-6 h-6" />, color: 'text-red-500' }
];

const FEATURES_TO_RATE = [
    { id: 'quizzes', name: 'Quiz Experience', description: 'MCQs, scoring, explanations' },
    { id: 'currentAffairs', name: 'Current Affairs', description: 'Content quality and relevance' },
    { id: 'ui', name: 'User Interface', description: 'Design, navigation, ease of use' },
    { id: 'performance', name: 'Performance', description: 'Speed, loading times, responsiveness' },
    { id: 'mobile', name: 'Mobile Experience', description: 'Mobile app or website on mobile' },
    { id: 'support', name: 'Customer Support', description: 'Help center, response times' }
];

export default function Feedback() {
    const [step, setStep] = useState(1);
    const [selectedFeedbackType, setSelectedFeedbackType] = useState('');
    const [overallSatisfaction, setOverallSatisfaction] = useState(0);
    const [featureRatings, setFeatureRatings] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        email: '',
        name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureRating = (featureId, rating) => {
        setFeatureRatings(prev => ({
            ...prev,
            [featureId]: rating
        }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const resetForm = () => {
        setStep(1);
        setSelectedFeedbackType('');
        setOverallSatisfaction(0);
        setFeatureRatings({});
        setFormData({
            title: '',
            description: '',
            email: '',
            name: ''
        });
        setIsSubmitted(false);
    };

    const canProceedToNext = () => {
        if (step === 1) return selectedFeedbackType;
        if (step === 2) return overallSatisfaction > 0;
        if (step === 3) return Object.keys(featureRatings).length > 0;
        return formData.title && formData.description;
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-transparent dark:text-white overflow-hidden p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                            💚
                        </div>
                        <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Thank You for Your Feedback!</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                            Your input helps us create a better experience for everyone.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            We review all feedback and use it to guide our improvements.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={resetForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                            >
                                Submit More Feedback
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold px-8 py-3 rounded-lg transition-colors">
                                Back to App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                💬
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">
                                Share Your Feedback
                            </h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Help us improve by sharing your thoughts, ideas, and experiences
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-7xl mx-auto mb-8">
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Step {step} of 4</span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{Math.round((step / 4) * 100)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {/* Step 1: Feedback Type */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">What kind of feedback do you have?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {FEEDBACK_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedFeedbackType(type.id)}
                                            className={`text-left p-6 rounded-xl border-2 transition-all ${selectedFeedbackType === type.id
                                                ? 'border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-gray-200 dark:border-white/20 hover:border-purple-200 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                                                }`}
                                        >
                                            <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                                                {type.icon}
                                            </div>
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">{type.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{type.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Overall Satisfaction */}
                        {step === 2 && (
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">How satisfied are you overall?</h2>
                                <div className="space-y-4">
                                    {SATISFACTION_LEVELS.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => setOverallSatisfaction(level.value)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${overallSatisfaction === level.value
                                                ? 'border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-gray-200 dark:border-white/20 hover:border-purple-200 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                                                }`}
                                        >
                                            <div className={level.color}>
                                                {level.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold dark:text-white text-gray-900">{level.label}</div>
                                                <div className="flex space-x-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < level.value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Feature Ratings */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Rate specific features</h2>
                                <div className="space-y-6">
                                    {FEATURES_TO_RATE.map((feature) => (
                                        <div key={feature.id} className="border border-gray-200 dark:border-white/20 rounded-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-semibold dark:text-white text-gray-900">{feature.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => handleFeatureRating(feature.id, rating)}
                                                        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${(featureRatings[feature.id] || 0) >= rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300 hover:text-yellow-400'
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Detailed Feedback */}
                        {step === 4 && (
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                    <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Tell us more</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Feedback Title *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Brief summary of your feedback"
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Detailed Feedback *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={6}
                                                placeholder="Please share your detailed feedback, suggestions, or ideas..."
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Name (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Your name"
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Email (Optional)
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Your Feedback Summary:</h4>
                                            <div className="text-sm space-y-1">
                                                <p className="text-blue-700 dark:text-blue-200">
                                                    <span className="font-medium">Type:</span> {FEEDBACK_TYPES.find(t => t.id === selectedFeedbackType)?.title}
                                                </p>
                                                <p className="text-blue-700 dark:text-blue-200">
                                                    <span className="font-medium">Overall Satisfaction:</span>
                                                    <span className="ml-2 inline-flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < overallSatisfaction ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </span>
                                                </p>
                                                <p className="text-blue-700 dark:text-blue-200">
                                                    <span className="font-medium">Features Rated:</span> {Object.keys(featureRatings).length} out of {FEATURES_TO_RATE.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    disabled={!canProceedToNext()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    <span>Next</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !canProceedToNext()}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Feedback Statistics */}
                    <div className="max-w-7xl mx-auto mt-12">
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6 text-center">Community Feedback Impact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        💡
                                    </div>
                                    <h4 className="font-bold dark:text-white text-gray-900 text-2xl">847</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Feature Requests</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        ✅
                                    </div>
                                    <h4 className="font-bold dark:text-white text-gray-900 text-2xl">156</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Features Implemented</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        ⭐
                                    </div>
                                    <h4 className="font-bold dark:text-white text-gray-900 text-2xl">4.7</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}