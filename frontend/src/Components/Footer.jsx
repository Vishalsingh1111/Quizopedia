import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Home,
    Brain,
    BookOpen,
    GraduationCap,
    Newspaper,
    ClipboardCheck,
    Calculator,
    Atom,
    Globe,
    TrendingUp,
    MessageCircle,
    Laptop,
    HelpCircle,
    Mail,
    MessageSquare,
    Bug,
    Star,
    Bot
} from 'lucide-react';

const Footer = () => {
    return (
        <>
            {/* Footer */}
            <footer className="bg-black border-t border-white/30 relative overflow-hidden">
                {/* Removed animated background overlay for simple black bg */}

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-white">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                        {/* Brand Section */}
                        <div className="lg:col-span-1 text-center lg:text-left">
                            <div className="mb-4">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    QUIZOPEDIA
                                </h2>
                                <p className="text-lg italic text-gray-200 mb-4">AI-Powered Quiz Platform</p>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    Master your skills with comprehensive quizzes featuring aptitude tests, subject-based questions, exam preparations, and current affairs powered by AI.
                                </p>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex justify-center lg:justify-start space-x-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Visit our Facebook page"
                                >
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110 group-hover:shadow-lg">
                                        <Facebook size={18} className="transition-transform group-hover:scale-110" />
                                    </div>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Follow us on Twitter"
                                >
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:scale-110 group-hover:shadow-lg">
                                        <Twitter size={18} className="transition-transform group-hover:scale-110" />
                                    </div>
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Connect with us on LinkedIn"
                                >
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 transition-all duration-300 group-hover:bg-blue-700 group-hover:scale-110 group-hover:shadow-lg">
                                        <Linkedin size={18} className="transition-transform group-hover:scale-110" />
                                    </div>
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Follow us on Instagram"
                                >
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 transition-all duration-300 group-hover:bg-pink-600 group-hover:scale-110 group-hover:shadow-lg">
                                        <Instagram size={18} className="transition-transform group-hover:scale-110" />
                                    </div>
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Subscribe to our YouTube channel"
                                >
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 transition-all duration-300 group-hover:bg-red-600 group-hover:scale-110 group-hover:shadow-lg">
                                        <Youtube size={18} className="transition-transform group-hover:scale-110" />
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                                    <Home size={16} />
                                </div>
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: Home, text: 'Home', to: '/' },
                                    { icon: Brain, text: 'Aptitude Tests', to: '/Quiz/Aptitude' },
                                    { icon: BookOpen, text: 'Subject Quizzes', to: '/Quiz/Subject' },
                                    { icon: GraduationCap, text: 'Exam Preparation', to: '/Quiz/Exam-Preparation' },
                                    { icon: Newspaper, text: 'Current Affairs', to: '/Quiz/Reader/Current-Affairs' },
                                    { icon: ClipboardCheck, text: 'Mock Tests', to: '/Quiz/Mock-Test' }
                                ].map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                                        >
                                            <item.icon size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                <div className="w-8 h-8 bg-white/20 dark:bg-white/30 dark:backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                                    <BookOpen size={16} />
                                </div>
                                Categories
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: Calculator, text: 'Mathematics', to: '/Quiz/Subject' },
                                    { icon: Atom, text: 'Science', to: '/Quiz/Subject' },
                                    { icon: Globe, text: 'General Knowledge', to: '/category/gk' },
                                    { icon: TrendingUp, text: 'Reasoning', to: '/Quiz/Aptitude' },
                                    { icon: MessageCircle, text: 'English', to: '/Quiz/Subject' },
                                    { icon: Laptop, text: 'Computer Science', to: '/Quiz/Computer' }
                                ].map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center text-white/80 dark:text-gray-300/80 hover:text-white dark:hover:text-purple-300 hover:translate-x-1 transition-all duration-300 group"
                                        >
                                            <item.icon size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                <div className="w-8 h-8 bg-white/20 dark:bg-white/30 dark:backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                                    <HelpCircle size={16} />
                                </div>
                                Support
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: Mail, text: 'Contact Us', to: '/Contact-Us' },
                                    { icon: MessageSquare, text: 'FAQ', to: '/FAQ' },
                                    { icon: Bug, text: 'Report Issue', to: '/Report-Issues' },
                                    { icon: Star, text: 'Feedback', to: '/Feedback' },
                                    { icon: Bot, text: 'AI Support', to: '/ai-support' }
                                ].map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center text-white/80 dark:text-gray-300/80 hover:text-white dark:hover:text-purple-300 hover:translate-x-1 transition-all duration-300 group"
                                        >
                                            <item.icon size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/20 dark:border-white/30 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-center md:text-left">
                                <p className="text-white/80 dark:text-gray-300/80 text-sm">
                                    © {new Date().getFullYear()} QUIZOPEDIA. All rights reserved. | Powered by AI Technology
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-end gap-6">
                                {[
                                    { text: 'Privacy Policy', to: '/privacy' },
                                    { text: 'Terms of Service', to: '/terms' },
                                    { text: 'Cookie Policy', to: '/cookies' },
                                    { text: 'Accessibility', to: '/accessibility' }
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.to}
                                        className="text-white/80 dark:text-gray-300/80 hover:text-white dark:hover:text-purple-300 text-sm transition-colors duration-300"
                                    >
                                        {item.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-bounce"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/30 rounded-full blur-xl animate-ping"></div>
                </div>
            </footer>
        </>
    );
};

export default Footer;