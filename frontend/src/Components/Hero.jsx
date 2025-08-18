import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = ({ selectedCategory, setSelectedCategory }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mr-4">
                        🧠
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        AI Powered Quizes
                    </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-100 max-w-3xl mx-auto">
                    Access the largest collection of AI-powered quiz categories available on the web ⭐
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col items-center justify-between mb-8 space-y-4 md:space-y-5 md:space-x-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0 flex-wrap">
                    {/* Category Select */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
                        >
                            <option>-- Select a category --</option>
                            <option>Subject Based</option>
                            <option>Aptitude Based</option>
                            <option>Exam Based</option>
                            <option>Current Affairs</option>
                            <option>General Knowledge</option>
                            <option>Speed Quiz</option>
                            <option>Mock Tests</option>
                            <option>Premium</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg text-sm font-medium">Free AI</button>
                        <button className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium">Freemium</button>
                        <button className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium">Paid</button>
                        <button className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium">Free Trial</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
