
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const cityRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cityRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage of screen
      const xPercent = clientX / innerWidth;
      const yPercent = clientY / innerHeight;
      
      // Apply subtle parallax effect (max 10px movement)
      const moveX = (xPercent - 0.5) * 10;
      const moveY = (yPercent - 0.5) * 10;
      
      cityRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Abstract Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
        <div className="lg:w-1/2 space-y-8 animate-fade-in">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Build Cities with SQL
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Learn SQL by <br />
              <span className="text-primary">Building Virtual Cities</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Write SQL queries to create buildings, add floors, and watch your city grow. A fun, interactive way to master database concepts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/learn" 
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium text-lg button-hover-effect flex items-center justify-center gap-2 group"
            >
              Start Building
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join 1,000+ students mastering SQL through play
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="glass rounded-xl p-6 shadow-xl max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-xs font-medium text-gray-500">sql_cityscape.db</div>
            </div>
            
            <div className="font-mono bg-gray-900 text-green-400 text-sm p-4 rounded-md overflow-hidden">
              <div className="typing-container">
                <span className="typing-text">
                  CREATE TABLE building (<br/>
                  &nbsp;&nbsp;id INTEGER PRIMARY KEY,<br/>
                  &nbsp;&nbsp;name TEXT,<br/>
                  &nbsp;&nbsp;height INTEGER<br/>
                  );<br/><br/>
                  
                  INSERT INTO building (name, height)<br/>
                  VALUES ('Tower', 5);
                </span>
              </div>
            </div>
            
            <div 
              ref={cityRef} 
              className="mt-4 w-full h-64 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 rounded-md flex items-center justify-center transition-transform duration-200 ease-out"
            >
              <div className="w-24 h-40 bg-white dark:bg-gray-800 shadow-lg transform translate-y-10 rounded-t-md relative animate-city-pulse">
                {[1, 2, 3, 4, 5].map((floor) => (
                  <div 
                    key={floor}
                    className="absolute w-full h-7 border-t border-gray-200 dark:border-gray-700"
                    style={{ bottom: `${(floor - 1) * 7}px` }}
                  >
                    {[1, 2, 3].map((window) => (
                      <div 
                        key={`${floor}-${window}`}
                        className="absolute w-3 h-4 bg-blue-400 dark:bg-blue-600 rounded-sm"
                        style={{ left: `${(window * 6) - 3}px`, bottom: '1.5px' }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
