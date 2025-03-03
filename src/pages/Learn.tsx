
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LevelInterface from '../components/LevelInterface';

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <LevelInterface />
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
