import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Users, Settings, Shield, CreditCard } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";

const FAQ_CATEGORIES = [
    {
        id: 'general',
        title: 'General Questions',
        icon: <HelpCircle className="w-6 h-6" />,
        color: 'from-blue-500 to-cyan-500',
        count: 8
    },
    {
        id: 'account',
        title: 'Account & Profile',
        icon: <Users className="w-6 h-6" />,
        color: 'from-purple-500 to-emerald-500',
        count: 6
    },
    {
        id: 'quizzes',
        title: 'Quizzes & Tests',
        icon: <BookOpen className="w-6 h-6" />,
        color: 'from-purple-500 to-pink-500',
        count: 10
    },
    {
        id: 'technical',
        title: 'Technical Issues',
        icon: <Settings className="w-6 h-6" />,
        color: 'from-red-500 to-orange-500',
        count: 5
    },
    {
        id: 'privacy',
        title: 'Privacy & Security',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-indigo-500 to-purple-500',
        count: 4
    },
    {
        id: 'billing',
        title: 'Billing & Payment',
        icon: <CreditCard className="w-6 h-6" />,
        color: 'from-yellow-500 to-orange-500',
        count: 3
    }
];

const FAQ_DATA = {
    general: [
        {
            question: "What is this platform about?",
            answer: "Our platform provides interactive quizzes and current affairs updates to help users test their knowledge and stay informed about recent events in politics, economics, sports, technology, and more."
        },
        {
            question: "Is the platform free to use?",
            answer: "Yes, basic features are completely free. We also offer premium features with additional quiz categories, detailed explanations, and advanced analytics for a small subscription fee."
        },
        {
            question: "How often is the content updated?",
            answer: "Current affairs content is updated daily, weekly, and monthly depending on the time period you select. Our AI system ensures you get the most relevant and up-to-date information."
        },
        {
            question: "Can I use this on mobile devices?",
            answer: "Absolutely! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers."
        },
        {
            question: "Do I need to create an account?",
            answer: "While you can try some features without an account, creating one allows you to track your progress, save quiz history, and access personalized recommendations."
        },
        {
            question: "What languages are supported?",
            answer: "Currently, our platform is available in English. We're working on adding support for more languages in future updates."
        },
        {
            question: "How can I contact support?",
            answer: "You can reach our support team through email at support@example.com, live chat on our website, or by calling +1 (555) 123-4567 during business hours."
        },
        {
            question: "Are there any age restrictions?",
            answer: "Our platform is designed for users aged 13 and above. Users under 18 should have parental consent before creating an account."
        }
    ],
    account: [
        {
            question: "How do I create an account?",
            answer: "Click the 'Sign Up' button, enter your email and create a password. You'll receive a verification email to activate your account."
        },
        {
            question: "I forgot my password. How can I reset it?",
            answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link."
        },
        {
            question: "Can I change my username?",
            answer: "Yes, you can update your username in your profile settings. Note that usernames must be unique and follow our community guidelines."
        },
        {
            question: "How do I delete my account?",
            answer: "Go to Account Settings > Privacy > Delete Account. This action is permanent and cannot be undone."
        },
        {
            question: "Can I have multiple accounts?",
            answer: "We recommend using one account per person. Multiple accounts may be restricted to prevent abuse of our free tier limits."
        },
        {
            question: "How do I update my profile information?",
            answer: "Navigate to your profile settings where you can update your name, email, profile picture, and other personal information."
        }
    ],
    quizzes: [
        {
            question: "How are quiz questions generated?",
            answer: "Our AI system generates questions based on recent news and events from reliable sources. Questions are reviewed for accuracy and relevance."
        },
        {
            question: "Can I retake a quiz?",
            answer: "Yes! You can retake any quiz as many times as you'd like. Each attempt may have different questions to keep the experience fresh."
        },
        {
            question: "How is my score calculated?",
            answer: "Your score is calculated as the number of correct answers divided by total questions. Detailed explanations help you understand the reasoning behind each answer."
        },
        {
            question: "Can I pause a quiz and continue later?",
            answer: "Currently, quizzes must be completed in one session. We're working on adding a pause/resume feature in future updates."
        },
        {
            question: "What happens if I don't answer all questions?",
            answer: "You can submit a quiz with unanswered questions, but only answered questions will be counted toward your score."
        },
        {
            question: "Are quiz results saved?",
            answer: "Yes, all your quiz results are saved in your history. You can view detailed breakdowns of your performance over time."
        },
        {
            question: "Can I share my quiz results?",
            answer: "You can share your quiz scores on social media or with friends using the share buttons after completing a quiz."
        },
        {
            question: "How many questions are in each quiz?",
            answer: "You can choose between 5, 10, 15, or 20 questions per quiz depending on how much time you have available."
        },
        {
            question: "Do quizzes have time limits?",
            answer: "No, there are no time limits. Take as much time as you need to read and answer each question carefully."
        },
        {
            question: "Can I suggest quiz topics?",
            answer: "Absolutely! We welcome topic suggestions through our feedback form or by contacting our support team."
        }
    ],
    technical: [
        {
            question: "The app is loading slowly. What should I do?",
            answer: "Try refreshing your browser, clearing cache, or checking your internet connection. If issues persist, contact our support team."
        },
        {
            question: "I'm getting error messages. How can I fix this?",
            answer: "Try refreshing the page first. If the error continues, take a screenshot and contact support with details about what you were doing when the error occurred."
        },
        {
            question: "Which browsers are supported?",
            answer: "We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated."
        },
        {
            question: "Why am I not receiving email notifications?",
            answer: "Check your spam folder first. If emails aren't there, verify your email settings in your profile and ensure our domain isn't blocked."
        },
        {
            question: "The website looks broken on my device. What's wrong?",
            answer: "This might be a display issue. Try clearing your browser cache, disabling browser extensions, or trying a different browser."
        }
    ],
    privacy: [
        {
            question: "How is my personal data protected?",
            answer: "We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties."
        },
        {
            question: "What information do you collect?",
            answer: "We collect basic account information (email, username) and quiz performance data to improve your experience. Full details are in our Privacy Policy."
        },
        {
            question: "Can I download my data?",
            answer: "Yes, you can request a copy of all your data through your account settings. We'll provide it in a standard format within 30 days."
        },
        {
            question: "Do you use cookies?",
            answer: "We use essential cookies for functionality and optional cookies for analytics. You can manage cookie preferences in your browser settings."
        }
    ],
    billing: [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for premium subscriptions."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee for new subscribers. Contact support for assistance with refund requests."
        }
    ]
};

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const filteredFAQs = FAQ_DATA[selectedCategory].filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                ❓
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Find answers to common questions about our platform
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-transparent dark:text-white p-6 mb-8">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Category Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden sticky top-8">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        {FAQ_CATEGORIES.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full text-left p-3 rounded-lg transition-all ${selectedCategory === category.id
                                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                                                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                                                        {category.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{category.title}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-500">{category.count} questions</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-white/10">
                                    <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                                        {FAQ_CATEGORIES.find(cat => cat.id === selectedCategory)?.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {filteredFAQs.length} questions found
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-white/10">
                                    {filteredFAQs.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl mx-auto mb-4">
                                                🔍
                                            </div>
                                            <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">No results found</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Try a different search term or browse other categories</p>
                                        </div>
                                    ) : (
                                        filteredFAQs.map((faq, index) => (
                                            <div key={index} className="p-6">
                                                <button
                                                    onClick={() => toggleExpanded(index)}
                                                    className="w-full text-left flex items-center justify-between hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <h3 className="text-lg font-semibold dark:text-white text-gray-900 pr-4">
                                                        {faq.question}
                                                    </h3>
                                                    {expandedItems[index] ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {expandedItems[index] && (
                                                    <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Still need help section */}
                            <div className="mt-8 bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                                    <HelpCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">Still need help?</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Can't find what you're looking for? Our support team is here to help.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button Link to="/Contact" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                                        Contact Support
                                    </button>
                                    <button className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-semibold px-6 py-3 rounded-lg transition-colors">
                                        Live Chat
                                    </button>
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