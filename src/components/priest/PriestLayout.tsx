
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Book, Calendar, User, Home, BookOpen } from 'lucide-react';

interface PriestLayoutProps {
  children: React.ReactNode;
}

const PriestLayout = ({ children }: PriestLayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-amber-50/80 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Priest Header with Breadcrumb */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-spiritual-gold/10 pb-6">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-spiritual-gold/10 text-spiritual-brown dark:text-spiritual-cream">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild><Link to="/priest">Priest Portal</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-bold font-sanskrit bg-gradient-to-r from-spiritual-brown to-spiritual-gold dark:from-spiritual-cream dark:to-spiritual-gold bg-clip-text text-transparent">
                  Priest Dashboard
                </h1>
                <div className="flex items-center mt-1">
                  <Book className="h-4 w-4 text-spiritual-brown/70 dark:text-spiritual-cream/70 mr-1" />
                  <p className="text-spiritual-brown/70 dark:text-spiritual-cream/70">
                    Manage your rituals, ceremonies, and teachings
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Button 
                className="bg-spiritual-gold hover:bg-spiritual-gold/90 transition-all shadow-md hover:shadow-lg text-white"
                onClick={() => window.location.href = '/profile'}
              >
                <User className="h-4 w-4 mr-2" /> Profile
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Dashboard Home"
                  onClick={() => window.location.href = '/priest'}
                >
                  <Home className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Schedule"
                  onClick={() => window.location.href = '/priest#schedule'}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Teachings"
                  onClick={() => window.location.href = '/priest#teachings'}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-white/40 dark:border-gray-700/30">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PriestLayout;
