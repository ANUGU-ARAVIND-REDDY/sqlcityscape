
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Build Your SQL City?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10">
              Join thousands of students who are learning SQL in a fun, interactive way.
              Start your journey today and see your city grow with every query!
            </p>
            
            <Link 
              to="/learn" 
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-white font-medium text-lg button-hover-effect"
            >
              Start Building Your City
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
