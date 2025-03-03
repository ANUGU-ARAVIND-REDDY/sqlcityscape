
import React from 'react';
import { Code, Database, BookOpen, Trophy } from 'lucide-react';

const features = [
  {
    icon: <Code className="w-10 h-10 text-primary" />,
    title: "Interactive SQL Learning",
    description: "Practice SQL commands in an intuitive code editor with real-time syntax highlighting and validation."
  },
  {
    icon: <Database className="w-10 h-10 text-primary" />,
    title: "Visual Database Concepts",
    description: "See your queries transform into visual elements as you build your city, making abstract concepts concrete."
  },
  {
    icon: <BookOpen className="w-10 h-10 text-primary" />,
    title: "Guided Progression",
    description: "Progress through structured levels that introduce new SQL concepts gradually, from basic CRUD operations to complex joins."
  },
  {
    icon: <Trophy className="w-10 h-10 text-primary" />,
    title: "Achievement System",
    description: "Earn badges and unlock new city elements as you master different SQL skills and complete challenges."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">How SQLCityscape Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Combine the power of SQL with the creativity of city building in an educational experience unlike any other.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-1 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/10 mb-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Learning Journey
              </div>
              <h3 className="text-2xl font-bold mb-4">From SQL Novice to Database Architect</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our carefully crafted curriculum takes you from basic SQL commands to complex database operations through hands-on city building challenges.
              </p>
              
              <div className="space-y-4">
                {['CREATE structures', 'INSERT building details', 'SELECT specific buildings', 'UPDATE your cityscape'].map((step, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-primary text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-8 md:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg transform rotate-3"></div>
                <div className="relative glass rounded-lg p-6">
                  <div className="font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-md mb-4">
                    <div>
                      <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> buildings<br/>
                      <span className="text-blue-400">WHERE</span> height {'>'} 3<br/>
                      <span className="text-blue-400">ORDER BY</span> construction_date;
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="aspect-square bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center justify-center"
                      >
                        <div 
                          className="w-8 h-16 bg-gray-800 dark:bg-gray-600 rounded-t-sm"
                          style={{ height: `${(i + 3) * 8}px` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
