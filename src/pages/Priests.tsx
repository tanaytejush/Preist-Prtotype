
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, DollarSign, Star, MapPin, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PriestProfile } from '@/types/priest';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Priests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  const { data: priests, isLoading, error } = useQuery({
    queryKey: ['priests'],
    queryFn: async () => {
      try {
        const { data: priestProfiles, error } = await supabase
          .from('priest_profiles')
          .select('*');
          
        if (error) {
          console.error("Error fetching priests:", error);
          throw error;
        }
        
        if (priestProfiles && priestProfiles.length > 0) {
          return priestProfiles as PriestProfile[];
        }
        
        // Fall back to mock data if no priests are found
        return [
          {
            id: '1',
            user_id: 'user-1',
            name: 'Swami Ananda',
            description: 'Experienced priest specializing in traditional ceremonies and spiritual guidance.',
            specialties: ['Vedic Rituals', 'Marriage Ceremonies', 'Blessing Ceremonies'],
            experience_years: 15,
            avatar_url: '/placeholder.svg',
            base_price: 100,
            availability: 'Weekdays 9am-5pm, Weekends by appointment',
            location: 'Local Temple',
            rating: 4.8
          },
          {
            id: '2',
            user_id: 'user-2',
            name: 'Pandit Sharma',
            description: 'Specializes in traditional Hindu ceremonies with deep knowledge of Vedic scriptures.',
            specialties: ['Puja Ceremonies', 'Vedic Astrology', 'Spiritual Counseling'],
            experience_years: 20,
            avatar_url: '/placeholder.svg',
            base_price: 120,
            availability: 'Available for ceremonies daily',
            location: 'Downtown Temple',
            rating: 4.9
          },
          {
            id: '3',
            user_id: 'user-3',
            name: 'Acharya Patel',
            description: 'Expert in traditional and modern ceremonies, bringing ancient wisdom to the present day.',
            specialties: ['House Warming', 'Baby Naming', 'Funeral Services'],
            experience_years: 10,
            avatar_url: '/placeholder.svg',
            base_price: 90,
            availability: 'Flexible schedule, available on short notice',
            location: 'Eastern Temple',
            rating: 4.7
          }
        ] as PriestProfile[];
      } catch (error) {
        console.error("Error in priest query:", error);
        throw error;
      }
    }
  });

  const handleSelectPriest = (priest: PriestProfile) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a priest for services.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    navigate(`/book-priest/${priest.id}`);
  };

  // Filter and search functionality
  const filteredPriests = priests?.filter(priest => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      priest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      priest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      priest.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply specialty filter
    const matchesSpecialty = filterSpecialty === 'all' ||
      priest.specialties.some(s => s.toLowerCase().includes(filterSpecialty.toLowerCase()));
    
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter dropdown
  const allSpecialties = priests?.flatMap(priest => priest.specialties) || [];
  const uniqueSpecialties = [...new Set(allSpecialties)];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-spiritual-gold animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-spiritual-cream dark:bg-gray-800 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-spiritual-gold animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-xl text-spiritual-brown dark:text-spiritual-cream font-sanskrit">Loading spiritual guides...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center max-w-lg p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-spiritual-gold/20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Priests</h2>
            <p className="text-gray-700 dark:text-gray-300">We encountered an issue while loading the priest profiles. Please try again later.</p>
            <Button onClick={() => window.location.reload()} className="mt-6 bg-spiritual-gold hover:bg-spiritual-gold/90">
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sanskrit bg-gradient-to-r from-spiritual-brown to-spiritual-gold dark:from-spiritual-cream dark:to-spiritual-gold bg-clip-text text-transparent">
              Connect With Our Dedicated Priests
            </h1>
            <p className="text-lg text-spiritual-brown/80 dark:text-spiritual-cream/80 max-w-3xl mx-auto leading-relaxed">
              Our experienced priests offer guidance and support for various religious ceremonies, 
              consultations, and spiritual needs. Each priest brings unique expertise and traditional 
              knowledge to serve your journey.
            </p>
          </div>
          
          {/* Filters Section */}
          <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search by name, location, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-50 dark:bg-gray-700 border-spiritual-gold/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-spiritual-gold/20">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-spiritual-gold" />
                      <SelectValue placeholder="Filter by specialty" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Priests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {filteredPriests && filteredPriests.map((priest) => (
              <Card 
                key={priest.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-spiritual-gold/20 hover:border-spiritual-gold/50 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-spiritual-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex justify-center pt-8 pb-4">
                    <Avatar className="h-28 w-28 border-4 border-spiritual-gold/30 group-hover:border-spiritual-gold transition-all duration-300 shadow-lg">
                      <img 
                        src={priest.avatar_url || '/placeholder.svg'} 
                        alt={priest.name} 
                        className="object-cover"
                      />
                    </Avatar>
                  </div>
                </div>
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="text-2xl font-sanskrit text-spiritual-brown dark:text-spiritual-cream">{priest.name}</CardTitle>
                  <div className="flex items-center justify-center mt-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.round(priest.rating || 5) ? 'fill-current' : 'fill-none'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({(priest.rating || 5).toFixed(1)})</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {priest.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-spiritual-brown dark:text-spiritual-cream/90 border-spiritual-gold/30">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="text-center px-6">
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{priest.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center text-gray-700 dark:text-gray-300 gap-1 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                      <Calendar className="h-4 w-4 text-spiritual-gold" />
                      <span>{priest.experience_years} Years</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-700 dark:text-gray-300 gap-1 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                      <DollarSign className="h-4 w-4 text-spiritual-gold" />
                      <span>From ${priest.base_price}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-gray-700 dark:text-gray-300 gap-1 mt-4">
                    <MapPin className="h-4 w-4 text-spiritual-gold" />
                    <span>{priest.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6 px-6">
                  <Button 
                    onClick={() => handleSelectPriest(priest)} 
                    className="w-full bg-gradient-to-r from-spiritual-gold to-amber-500 hover:from-amber-500 hover:to-spiritual-gold text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Book Services
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredPriests && filteredPriests.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-medium text-spiritual-brown dark:text-spiritual-cream">No priests match your search</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Try adjusting your search filters.</p>
                <Button 
                  onClick={() => {setSearchTerm(''); setFilterSpecialty('all');}}
                  variant="outline" 
                  className="mt-4 border-spiritual-gold/30 text-spiritual-brown dark:text-spiritual-cream"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-spiritual-gold/20 to-amber-300/20 dark:from-spiritual-gold/10 dark:to-amber-700/10 rounded-xl p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-sanskrit font-bold text-spiritual-brown dark:text-spiritual-cream mb-4">
              Interested in Becoming a Priest?
            </h2>
            <p className="text-spiritual-brown/80 dark:text-spiritual-cream/80 mb-6">
              If you have knowledge in Hindu ceremonies and rituals, consider joining our network of dedicated priests.
            </p>
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline"
              className="border-spiritual-gold text-spiritual-brown dark:text-spiritual-cream hover:bg-spiritual-gold/20"
            >
              Apply in Your Profile
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Priests;
