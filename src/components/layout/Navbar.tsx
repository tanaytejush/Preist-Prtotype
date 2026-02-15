
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when transitioning from mobile to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-focus first link when mobile menu opens
  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector('a');
      firstLink?.focus();
    }
  }, [isOpen]);

  const signOut = async () => {
    try {
      // Fix: Properly await the sign-out operation
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      
      // Ensure we redirect to home after sign out
      navigate('/');
      
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Teachings', path: '/teachings' },
    { name: 'Donate', path: '/donate' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-spiritual-brown to-spiritual-gold font-sanskrit transition-colors duration-300">
                Spiritual Center
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-spiritual-brown hover:text-spiritual-gold dark:text-spiritual-cream dark:hover:text-spiritual-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-spiritual-gold/30 hover:ring-spiritual-gold/60 transition-all duration-300">
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || ''} />
                      <AvatarFallback className="bg-spiritual-gold text-white">
                        {(user.user_metadata.full_name || user.email || '').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-1">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-spiritual-cream dark:hover:bg-gray-800">Profile</DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer hover:bg-spiritual-cream dark:hover:bg-gray-800">Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="spiritual" size="sm">
                Sign In
              </Button>
            )}
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-spiritual-brown dark:text-spiritual-cream focus:outline-none focus:ring-2 focus:ring-inset focus:ring-spiritual-gold transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden" ref={mobileMenuRef} role="navigation" aria-label="Mobile menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-spiritual-brown dark:text-spiritual-cream hover:text-spiritual-gold dark:hover:text-spiritual-gold block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="border-t border-spiritual-brown/10 dark:border-gray-700 mt-4 pt-4">
                <div className="flex items-center px-3">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-spiritual-gold/30">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || ''} />
                    <AvatarFallback className="bg-spiritual-gold text-white">
                      {(user.user_metadata.full_name || user.email || '').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-spiritual-brown dark:text-spiritual-cream">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-xs text-spiritual-brown/70 dark:text-spiritual-cream/70">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="text-spiritual-brown dark:text-spiritual-cream hover:text-spiritual-gold dark:hover:text-spiritual-gold block px-3 py-2 rounded-md text-base font-medium mt-2 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-spiritual-brown dark:text-spiritual-cream hover:text-spiritual-gold dark:hover:text-spiritual-gold block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-spiritual-brown/10 dark:border-gray-700 mt-4 pt-4">
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }} 
                  variant="spiritual"
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
