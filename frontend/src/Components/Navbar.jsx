import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Wait for Google Translate to be ready and then change language
    const changeLanguage = (lang) => {
        const waitForGoogleTranslate = (attempts = 0) => {
            const maxAttempts = 50; // Try for 5 seconds (50 * 100ms)

            const selectField = document.querySelector(".goog-te-combo");

            if (selectField) {
                console.log("Google Translate element found:", selectField);
                selectField.value = lang;
                // Try multiple event types for better compatibility
                const changeEvent = new Event("change", { bubbles: true });
                const inputEvent = new Event("input", { bubbles: true });

                selectField.dispatchEvent(changeEvent);
                selectField.dispatchEvent(inputEvent);

                console.log("Language changed to:", lang);
            } else if (attempts < maxAttempts) {
                console.log(`Attempt ${attempts + 1}: Google Translate not ready, retrying...`);
                setTimeout(() => waitForGoogleTranslate(attempts + 1), 100);
            } else {
                console.error("Google Translate element not found after maximum attempts");
                // Fallback method using hash
                try {
                    window.location.hash = `#googtrans(en|${lang})`;
                    window.location.reload();
                } catch (e) {
                    console.error("Fallback translation method also failed:", e);
                }
            }
        };

        waitForGoogleTranslate();
        setLangOpen(false);
    };

    // Check if Google Translate is loaded and ensure it initializes
    useEffect(() => {
        const handleGoogleTranslateReady = () => {
            console.log('Google Translate is ready via event');
        };

        // Listen for custom ready event
        window.addEventListener('googleTranslateReady', handleGoogleTranslateReady);

        const initializeGoogleTranslate = () => {
            // Check if Google Translate script is loaded
            if (window.googleTranslateReady) {
                console.log("Google Translate is confirmed ready");
                return;
            }

            if (typeof window.google !== 'undefined' && window.google.translate) {
                console.log("Google Translate API is available");

                // Check if the translate element exists
                const checkTranslateElement = (attempts = 0) => {
                    const maxAttempts = 30;
                    const translateElement = document.querySelector(".goog-te-combo");

                    if (translateElement) {
                        console.log("Google Translate dropdown is ready");
                        window.googleTranslateReady = true;
                    } else if (attempts < maxAttempts) {
                        setTimeout(() => checkTranslateElement(attempts + 1), 200);
                    } else {
                        console.warn("Google Translate dropdown not found, trying to reinitialize...");
                        // Try to reinitialize
                        if (window.googleTranslateElementInit) {
                            try {
                                window.googleTranslateElementInit();
                            } catch (e) {
                                console.error("Failed to reinitialize Google Translate:", e);
                            }
                        }
                    }
                };

                checkTranslateElement();
            } else {
                console.log("Google Translate API not loaded yet, retrying...");
                setTimeout(initializeGoogleTranslate, 500);
            }
        };

        // Start checking after component mounts
        const timer = setTimeout(initializeGoogleTranslate, 1000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('googleTranslateReady', handleGoogleTranslateReady);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-md border-b border-white/20 dark:border-white/30 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link
                            to="/"
                            className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                        >
                            QZ
                        </Link>
                        <Link
                            to="/"
                            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
                        >
                            QUIZOPEDIA
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                        >
                            HOME
                        </Link>
                        <Link
                            to="/FAQ"
                            className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            to="/Contact-Us"
                            className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                        >
                            CONTACT
                        </Link>

                        {/* Language Dropdown - Only Hindi and English */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                <Globe size={18} />
                            </button>
                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                    <button
                                        onClick={() => changeLanguage("en")}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        🇬🇧 English
                                    </button>
                                    <button
                                        onClick={() => changeLanguage("hi")}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        🇮🇳 हिंदी
                                    </button>
                                </div>
                            )}
                        </div>

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

                    {/* Mobile Language Dropdown - Only Hindi and English */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            <Globe size={18} />
                            <span>Language</span>
                        </button>
                        {langOpen && (
                            <div className="mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                                <button
                                    onClick={() => {
                                        changeLanguage("en");
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    🇬🇧 English
                                </button>
                                <button
                                    onClick={() => {
                                        changeLanguage("hi");
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    🇮🇳 हिंदी
                                </button>
                            </div>
                        )}
                    </div>

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