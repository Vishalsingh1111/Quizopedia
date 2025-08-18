import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import QuizCards from './Components/QuizCard';
import Footer from './Components/Footer';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('-- Select a category --');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-200 dark:from-black dark:via-black dark:to-[#120024] pt-20">

            <Navbar />

            <main>
                <Hero
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <QuizCards selectedCategory={selectedCategory} />
            </main>
            <Footer />
        </div>
    );
};

export default Home;