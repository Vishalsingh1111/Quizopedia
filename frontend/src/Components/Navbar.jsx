import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-md border-b border-white/20 dark:border-white/30 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                            QZ
                        </Link>
                        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">QUIZOPEDIA</Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">HOME</Link>
                        <Link to="/FAQ" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">FAQ</Link>
                        <Link to="/Contact-Us" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">CONTACT</Link>

                        {/* Dark/Light Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-5 px-4 pb-4 space-y-4 flex flex-col">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                    >
                        HOME
                    </Link>
                    <Link
                        to="/FAQ"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                    >
                        FAQ
                    </Link>
                    <Link
                        to="/Contact-Us"
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                    >
                        CONTACT
                    </Link>

                    {/* Dark/Light Toggle */}
                    <button
                        onClick={() => {
                            toggleTheme();
                            setIsOpen(false);
                        }}
                        className="p-2 w-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
