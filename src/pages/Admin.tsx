
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTabs from '@/components/admin/AdminTabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive"
        });
        navigate('/auth');
      } else if (!accessChecked) {
        setAccessChecked(true);
        toast({
          title: "Welcome to Admin Dashboard",
          description: "You now have access to manage your spiritual center.",
        });
      }
    }
  }, [user, isAdmin, isLoading, navigate, toast, accessChecked]);

  // Improved loading state with animation
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-spiritual-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="p-8 rounded-xl bg-white/60 dark:bg-gray-800/30 backdrop-blur-md shadow-lg flex flex-col items-center border border-white/40 dark:border-gray-700/30">
          <div className="text-spiritual-gold">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
          </div>
          <p className="text-spiritual-brown dark:text-gray-200 font-sanskrit text-xl">Loading Admin Dashboard...</p>
          <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm mt-2">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Redirect handled in useEffect
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <AdminDashboardStats />
        
        {/* India Center Locations Map Alternative */}
        <Card>
          <CardHeader>
            <CardTitle>Program Locations in India</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] rounded-md overflow-hidden border border-gray-200 bg-amber-50/50 p-4">
              <h3 className="font-medium text-xl mb-6 text-center text-spiritual-brown">Our Spiritual Centers Across India</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { name: "Delhi Center", location: "Gandhi Nagar, Delhi", bg: "bg-orange-400", border: "border-t-orange-400" },
                  { name: "Mumbai Center", location: "Juhu Beach Area, Mumbai", bg: "bg-teal-300", border: "border-t-teal-300" },
                  { name: "Bangalore Center", location: "Indiranagar, Bangalore", bg: "bg-amber-300", border: "border-t-amber-300" },
                  { name: "Varanasi Center", location: "Dashashwamedh Ghat, Varanasi", bg: "bg-pink-300", border: "border-t-pink-300" },
                  { name: "Rishikesh Center", location: "Tapovan, Rishikesh", bg: "bg-emerald-400", border: "border-t-emerald-400" }
                ].map((center, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow border-t-4 ${center.border}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${center.bg}`}
                    >
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-medium text-spiritual-brown">{center.name}</h4>
                    <p className="text-sm text-spiritual-brown/70">{center.location}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-center mt-6 text-sm text-spiritual-brown/60">
                Visit any of our centers for spiritual guidance and community events
              </p>
            </div>
          </CardContent>
        </Card>
        
        <AdminTabs />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
