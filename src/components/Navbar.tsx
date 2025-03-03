
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6',
        isScrolled 
          ? 'backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">
              SQL
            </div>
            <span className="font-bold text-xl tracking-tight">CityScape</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn" className="nav-link">Learn</Link>
            <Link to="/about" className="nav-link">About</Link>
            
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 text-primary"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="px-6 py-2 rounded-md bg-primary text-white font-medium transition-all hover:bg-primary/90 button-hover-effect"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 p-4 glass animate-fade-in">
            <div className="flex flex-col space-y-4 pt-2 pb-3">
              <Link 
                to="/" 
                className="px-3 py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/learn" 
                className="px-3 py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Learn
              </Link>
              <Link 
                to="/about" 
                className="px-3 py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {isLoading ? (
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : user ? (
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium hover:text-primary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              ) : (
                <Link 
                  to="/auth" 
                  className="mt-2 w-full px-6 py-3 rounded-md bg-primary text-white font-medium transition-all hover:bg-primary/90 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
