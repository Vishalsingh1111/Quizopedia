import React from 'react';
import { Users, BookOpen, TrendingUp, Trophy, Globe, Clock } from 'lucide-react';

const QuizCards = ({ selectedCategory }) => {
    const quizCategories = [
        {
            id: 1,
            title: "Practice Any Quiz",
            icon: <Users className="w-6 h-6" />,
            description: "Practice Quiz on Any topic With advanced analytics, personalized learning paths, and unlimited access to all quiz categories.",
            bgGradient: "from-orange-400 to-pink-400",
            category: "Premium",
            link: "/Quiz/Practice"


        },
        {
            id: 2,
            title: "Aptitude Based MCQ",
            icon: <TrendingUp className="w-6 h-6" />,
            description: "Sharpen your logical reasoning and analytical skills. Perfect for job interviews, competitive exams, and cognitive ability assessments.",
            bgGradient: "from-purple-400 to-pink-400",
            category: "Aptitude Based",
            link: "Quiz/Aptitude"
        },
        {
            id: 3,
            title: "Current Affairs MCQ & News",
            icon: <Globe className="w-6 h-6" />,
            description: "Stay updated with the latest current affairs. Daily updated questions covering politics, economics, sports, technology, and global events.",
            bgGradient: "from-purple-400 to-indigo-400",
            category: "Current Affairs",
            link: "/Quiz/Reader/Current-Affairs"


        },
        {
            id: 4,
            title: "Exam Based MCQ",
            icon: <Trophy className="w-6 h-6" />,
            description: "Targeted preparation for specific competitive exams including JEE, NEET, GATE, CAT, and other entrance examinations with AI-powered insights.",
            bgGradient: "from-blue-400 to-purple-400",
            category: "Exam Based",
            link: "/quiz/exam-based"
        },
        {

            id: 5,
            title: "Subject Based MCQ",
            icon: <BookOpen className="w-6 h-6" />,
            description: "Comprehensive MCQs covering all major academic subjects. Practice with thousands of questions across Physics, Chemistry, Biology, Mathematics, and more.",
            tag: "TOP",
            bgGradient: "from-orange-400 to-red-400",
            category: "Subject Based",
            link: "/Quiz/Subject"


        },
        {
            id: 6,
            title: "General Knowledge MCQ",
            icon: <BookOpen className="w-6 h-6" />,
            description: "Broad-based general knowledge questions covering history, geography, science, literature, and miscellaneous topics for overall development.",
            bgGradient: "from-blue-400 to-cyan-400",
            category: "General Knowledge",
            link: "/Quiz/General-Knowledge"
        },
        {
            id: 7,
            title: "Speed Quiz Challenge",
            icon: <Clock className="w-6 h-6" />,
            description: "Test your quick thinking abilities with timed quizzes. Challenge yourself with rapid-fire questions and improve your response speed.",
            bgGradient: "from-gray-700 to-gray-900",
            category: "Speed Quiz",
            link: "/Quiz/Speed-Challenge"
        },
        {
            id: 8,
            title: "Mock Test Series",
            icon: <Trophy className="w-6 h-6" />,
            description: "Full-length mock tests simulating real exam conditions. Get detailed analytics and performance insights to track your progress.",
            bgGradient: "from-green-400 to-blue-400",
            category: "Mock Tests",
            link: "/quiz/mock-test-series"
        }

    ];

    const handleCardClick = (category) => {
        // Navigate to the specific quiz page
        window.location.href = category.link;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Quiz Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quizCategories
                    .filter(category =>
                        selectedCategory === '-- Select a category --' || category.category === selectedCategory
                    )
                    .map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCardClick(category)}
                            className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:text-white rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative group flex flex-col">
                            {/* Tag */}
                            {category.tag && (
                                <div className="absolute top-0 right-0 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                    {category.tag}
                                </div>
                            )}

                            {/* Header */}
                            <div className="p-6 pb-4 flex-grow">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${category.bgGradient} rounded-xl flex items-center justify-center text-white relative`}>
                                        {category.icon}
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold dark:text-white text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                                            {category.title}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-100 text-sm leading-relaxed text-center">
                                    {category.description}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="p-6 pt-0 flex justify-center">
                                <button className="w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                                    <span className="text-sm">START QUIZ</span>
                                </button>
                            </div>

                        </div>
                    ))}
            </div>
        </div>
    );
};

export default QuizCards;