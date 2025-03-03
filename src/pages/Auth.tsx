
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthForm from '../components/AuthForm';

const Auth = () => {
  const { user, loading } = useAuthSession();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/learn');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-16">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
