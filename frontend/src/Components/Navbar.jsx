import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-md border-b border-white/20 dark:border-white/30 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                            QZ
                        </Link>
                        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">QUIZOPEDIA</Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors cursor-pointer">Home</Link>
                        <Link to="/Contact-Us" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors cursor-pointer">Contact</Link>


                        {/* Dark/Light Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
