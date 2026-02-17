
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/common/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, UserCircle, LogOut, Shield, RefreshCw } from 'lucide-react';
import PriestApplicationSection from '@/components/profile/PriestApplicationSection';
import BookingsList from '@/components/profile/BookingsList';
import { UserProfile, PriestBooking } from '@/types/priest';

const Profile = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced fetch profile data with better error handling and retry mechanism
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log("Fetching profile data for user:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data fetched:", data);
      return data as unknown as UserProfile;
    },
    enabled: !!user,
    staleTime: 5000, // Consider data stale after 5 seconds
    refetchOnWindowFocus: true, // Refresh data when window regains focus
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user's priest bookings
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['priest-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('priest_bookings')
        .select('*, priest_profiles(name, avatar_url)')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return (data || []) as (PriestBooking & { priest_profiles: { name: string; avatar_url: string } | null })[];
    },
    enabled: !!user,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  // Fetch user's service bookings
  const {
    data: serviceBookings,
    isLoading: isServiceBookingsLoading,
    refetch: refetchServiceBookings,
  } = useQuery({
    queryKey: ['service-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*, services(title, icon, price)')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  // Implement a manual refresh function with visual feedback
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("Manual profile refresh triggered");
      await refetchProfile();
      toast({
        title: "Refreshed",
        description: "Your profile information has been updated"
      });
    } catch (error) {
      console.error("Error during manual refresh:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not update profile information"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view your profile',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  // Set form data when profile loads
  useEffect(() => {
    if (profile) {
      console.log("Setting form data from profile:", profile);
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      });
    }
  }, [profile]);

  // Auto refresh profile when active tab changes to ensure data freshness
  useEffect(() => {
    console.log("Active tab changed, refreshing profile data");
    refetchProfile();
  }, [activeTab, refetchProfile]);

  // Initial load and periodic check for status updates
  useEffect(() => {
    // Initial load
    refetchProfile();
    
    // Set up periodic checks for status updates
    const checkInterval = setInterval(() => {
      if (profile?.priest_status === 'pending') {
        console.log("Checking for priest status updates...");
        refetchProfile();
      }
    }, 15000); // Check every 15 seconds if status is pending
    
    return () => clearInterval(checkInterval);
  }, [refetchProfile, profile?.priest_status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });

      refetchProfile();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate immediately after sign out to prevent race conditions
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message || 'Failed to sign out. Please try again.',
      });
    }
  };

  if (authLoading || isProfileLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-spiritual-gold" />
            <p className="mt-4 text-lg text-spiritual-brown">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user || !profile) {
    return null; // Redirect happens in useEffect
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 min-h-screen bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="rounded-full h-8 w-8 p-0"
                      title="Refresh Profile"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </div>
                  
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage 
                      src={profile.avatar_url || undefined} 
                      alt={`${profile.first_name || ''} ${profile.last_name || ''}`} 
                    />
                    <AvatarFallback className="bg-spiritual-gold/20 text-spiritual-brown text-xl">
                      {profile.first_name?.[0] || ''}{profile.last_name?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  
                  <CardTitle className="mt-4">
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`
                      : 'User'
                    }
                  </CardTitle>
                  
                  <div className="flex justify-center gap-1 mt-2">
                    {profile.is_admin && (
                      <div className="px-2 py-1 text-xs bg-spiritual-gold/20 text-spiritual-brown rounded-full flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </div>
                    )}
                    
                    {profile.is_priest && (
                      <div className="px-2 py-1 text-xs bg-spiritual-gold/20 text-spiritual-brown rounded-full flex items-center">
                        <UserCircle className="h-3 w-3 mr-1" />
                        Priest
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-gray-500">Email</span>
                    <span>{user.email}</span>
                  </div>
                  
                  {profile.priest_status && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-500">Priest Status</span>
                      <span className={`font-medium ${
                        profile.priest_status === 'approved' ? 'text-green-600' : 
                        profile.priest_status === 'pending' ? 'text-amber-600' : 
                        'text-red-600'
                      }`}>
                        {profile.priest_status.charAt(0).toUpperCase() + profile.priest_status.slice(1)}
                      </span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 text-spiritual-brown"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>

              {/* Admin Dashboard Link */}
              {profile.is_admin && (
                <div className="mt-4">
                  <Button
                    onClick={() => navigate('/admin')}
                    variant="spiritual"
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </div>
              )}
              
              {/* Priest Dashboard Link */}
              {profile.is_priest && (
                <div className="mt-4">
                  <Button
                    onClick={() => navigate('/priest')}
                    variant="spiritual"
                    className="w-full"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Priest Dashboard
                  </Button>
                </div>
              )}
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="profile" className="flex-1">Profile Settings</TabsTrigger>
                  <TabsTrigger value="priest" className="flex-1">Priest Application</TabsTrigger>
                  <TabsTrigger value="bookings" className="flex-1">My Bookings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Enter your first name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button
                            type="submit"
                            variant="spiritual"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Updating...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="priest">
                  <PriestApplicationSection 
                    userId={user.id} 
                    priestStatus={profile.priest_status}
                    refetchProfile={refetchProfile}
                  />
                </TabsContent>
                
                <TabsContent value="bookings">
                  <div className="space-y-6">
                    {/* Priest Bookings */}
                    <div>
                      <h3 className="text-lg font-semibold text-spiritual-brown dark:text-spiritual-cream mb-3">Priest Bookings</h3>
                      {isBookingsLoading ? (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-spiritual-gold" />
                            <p className="mt-2 text-muted-foreground">Loading bookings...</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <BookingsList bookings={(bookings || []) as PriestBooking[]} />
                      )}
                    </div>

                    {/* Service Bookings */}
                    <div>
                      <h3 className="text-lg font-semibold text-spiritual-brown dark:text-spiritual-cream mb-3">Service Bookings</h3>
                      {isServiceBookingsLoading ? (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-spiritual-gold" />
                            <p className="mt-2 text-muted-foreground">Loading bookings...</p>
                          </CardContent>
                        </Card>
                      ) : serviceBookings && serviceBookings.length > 0 ? (
                        <div className="space-y-4">
                          {serviceBookings.map((booking: any) => (
                            <Card key={booking.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{booking.services?.title || 'Service Booking'}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(booking.booking_date).toLocaleDateString()}
                                    </p>
                                    {booking.notes && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{booking.notes}</p>
                                    )}
                                  </div>
                                  <Badge variant="outline" className={
                                    booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    booking.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                    booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                  }>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground mb-4">No service bookings yet.</p>
                            <Button variant="spiritual" size="sm" onClick={() => navigate('/services')}>
                              Browse Services
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
