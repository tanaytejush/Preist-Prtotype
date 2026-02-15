
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Settings, ChevronLeft, LayoutDashboard, Users, Calendar, BookOpen, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  
  // Get current section from pathname
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('users')) return 'Users';
    if (path.includes('events')) return 'Events';
    if (path.includes('teachings')) return 'Teachings';
    if (path.includes('contact')) return 'Contact';
    if (path.includes('donations')) return 'Donations';
    return '';
  };
  
  const currentSection = getCurrentSection();
  
  const handleQuickNavigation = (section: string) => {
    toast({
      title: `Navigating to ${section}`,
      description: `Scrolling to ${section} section.`,
    });

    // Scroll to the section
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/admin#' + section.toLowerCase());
      
      // Give it a moment to load before trying to scroll
      setTimeout(() => {
        const sectionElement = document.getElementById(section.toLowerCase());
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    toast({
      title: "Currency Updated",
      description: `Default currency set to ${e.target.value}`,
    });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    toast({
      title: "Region Updated",
      description: `Default region set to ${e.target.value}`,
    });
  };

  const handleRealTimeToggle = () => {
    toast({
      title: "Settings Updated",
      description: "Real-time updates setting has been saved",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-spiritual-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Header with Breadcrumb */}
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
                      <BreadcrumbLink asChild><Link to="/admin">Admin</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    {currentSection && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink>{currentSection}</BreadcrumbLink>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-3xl font-bold font-sanskrit bg-gradient-to-r from-spiritual-brown to-spiritual-gold dark:from-spiritual-cream dark:to-spiritual-gold bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <div className="flex items-center mt-1">
                  <LayoutDashboard className="h-4 w-4 text-spiritual-brown/70 dark:text-spiritual-cream/70 mr-1" />
                  <p className="text-spiritual-brown/70 dark:text-spiritual-cream/70">
                    Manage your spiritual center's content and users in India
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Button 
                className="bg-spiritual-gold hover:bg-spiritual-gold/90 transition-all shadow-md hover:shadow-lg text-white"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Manage Users"
                  onClick={() => handleQuickNavigation('Users')}
                >
                  <Users className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Manage Events"
                  onClick={() => handleQuickNavigation('Events')}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full" 
                  title="Manage Teachings"
                  onClick={() => handleQuickNavigation('Teachings')}
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

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Admin Settings</SheetTitle>
            <SheetDescription>
              Configure your admin dashboard preferences
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium" htmlFor="currency">
                      Currency
                    </label>
                    <select 
                      id="currency" 
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      defaultValue="INR"
                      onChange={handleCurrencyChange}
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                    <p className="text-xs text-spiritual-brown/60 mt-1">
                      All monetary values will be displayed in Indian Rupees (₹)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium" htmlFor="region">
                      Default Region
                    </label>
                    <select 
                      id="region" 
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      defaultValue="India"
                      onChange={handleRegionChange}
                    >
                      <option value="India">India</option>
                      <option value="Global">Global</option>
                    </select>
                    <p className="text-xs text-spiritual-brown/60 mt-1">
                      Maps and geographic data will default to India
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Dashboard Appearance</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="realTimeUpdates"
                      className="rounded border-gray-300"
                      defaultChecked
                      onChange={handleRealTimeToggle}
                    />
                    <label htmlFor="realTimeUpdates" className="ml-2 block text-sm">
                      Enable real-time updates
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={() => setIsSettingsOpen(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminLayout;
