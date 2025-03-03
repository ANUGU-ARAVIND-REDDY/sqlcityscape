
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Database, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About SQLCityscape</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                We're on a mission to make learning SQL fun, interactive, and accessible to everyone.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  SQLCityscape was born from a simple idea: what if learning SQL could be as engaging as playing a city-building game?
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Our platform transforms abstract database concepts into visual, tangible elements. Each SQL command you write has a direct impact on your virtual city, making the learning process intuitive and rewarding.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Whether you're a student, professional, or hobbyist, SQLCityscape provides an enjoyable path to SQL mastery through hands-on practice and immediate visual feedback.
                </p>
              </div>
              
              <div className="glass rounded-lg p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <BookOpen className="w-8 h-8 text-primary" />, title: "Learn", text: "Structured curriculum from basics to advanced SQL" },
                    { icon: <Users className="w-8 h-8 text-primary" />, title: "Engage", text: "Interactive challenges with visual feedback" },
                    { icon: <Database className="w-8 h-8 text-primary" />, title: "Build", text: "Create and expand your virtual SQL city" },
                    { icon: <Code className="w-8 h-8 text-primary" />, title: "Practice", text: "Real SQL syntax with immediate results" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-4">
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        {item.icon}
                      </div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                SQLCityscape is built by educators, developers, and database enthusiasts who believe learning should be both effective and enjoyable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Alex Johnson", role: "Founder & SQL Expert", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300" },
                { name: "Morgan Chen", role: "Lead Developer", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300" },
                { name: "Jamie Garcia", role: "Education Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300" },
              ].map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10">
              Ready to start your journey with SQLCityscape? Join thousands of learners who are mastering SQL while having fun.
            </p>
            
            <Link 
              to="/learn" 
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-white font-medium text-lg button-hover-effect"
            >
              Start Learning Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
