
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LevelInterface from '../components/LevelInterface';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Learn = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the learning content.",
      });
      navigate('/auth');
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect due to the useEffect above
  }

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
