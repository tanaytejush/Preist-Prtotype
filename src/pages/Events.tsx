
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EventsAPI, RegistrationsAPI, Event } from '@/api/supabaseUtils';

// Indian Rupee formatter
const formatToRupees = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Event images mapped to event themes
const eventImages = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop", // Meditation
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop", // Fire ceremony / havan
  "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop", // Bhagavad Gita / scripture study
  "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?q=80&w=1000&auto=format&fit=crop", // Sound healing / singing bowls
  "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1000&auto=format&fit=crop", // Spiritual retreat / mountains
  "https://images.unsplash.com/photo-1604608672516-f1b9b1d91e46?q=80&w=1000&auto=format&fit=crop", // Temple celebration / diya lamps
];

const Events = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState<string | null>(null);

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      // Fetch events
      const events = await EventsAPI.getAll();
      
      // If no events, use mock data
      if (events.length === 0) {
        return [
          {
            id: "1",
            title: "New Moon Meditation Circle",
            date: "2023-11-15",
            time: "7:00 PM - 9:00 PM",
            location: "Divine Temple Garden, Varanasi",
            description: "Join us for a powerful group meditation during the new moon to set intentions and connect with divine energy.",
            imageUrl: eventImages[0],
            price: 500,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            title: "Sacred Fire Ceremony",
            date: "2023-11-21",
            time: "5:30 AM - 7:00 AM",
            location: "Riverside Sanctuary, Rishikesh",
            description: "A traditional fire ceremony (havan) to purify the atmosphere and invoke divine blessings.",
            imageUrl: eventImages[1],
            price: 750,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            title: "Bhagavad Gita Study Group",
            date: "2023-11-28",
            time: "6:30 PM - 8:30 PM",
            location: "Wisdom Center, Delhi",
            description: "Weekly gathering to study and discuss the profound teachings of the Bhagavad Gita.",
            imageUrl: eventImages[2],
            price: 300,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "4",
            title: "Full Moon Sound Healing",
            date: "2023-11-30",
            time: "8:00 PM - 9:30 PM",
            location: "Crystal Dome, Goa",
            description: "Experience the healing vibrations of crystal bowls, gongs, and mantras during the full moon.",
            imageUrl: eventImages[3],
            price: 1200,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "5",
            title: "Spiritual Retreat Weekend",
            date: "2023-12-09",
            time: "Friday 4:00 PM - Sunday 2:00 PM",
            location: "Mountain Ashram, Himalayas",
            description: "An immersive weekend of meditation, yoga, silence, and spiritual teachings to deepen your practice.",
            imageUrl: eventImages[4],
            price: 15000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "6",
            title: "Winter Solstice Celebration",
            date: "2023-12-21",
            time: "7:00 PM - 10:00 PM",
            location: "Community Temple, Mumbai",
            description: "Celebrate the return of the light with sacred rituals, music, and community gathering.",
            imageUrl: eventImages[5],
            price: 800,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      // Add images to events if they don't have one
      events.forEach((event, index) => {
        if (!event.imageUrl || event.imageUrl === "/placeholder.svg") {
          event.imageUrl = eventImages[index % eventImages.length];
        }
      });
      
      // If user is logged in, check for registrations
      if (user) {
        try {
          const registrations = await RegistrationsAPI.getByUserId(user.id);
          const registeredEventIds = registrations.map(reg => reg.event_id);
          
          // Mark events as registered if the user has already registered
          return events.map(event => ({
            ...event,
            isRegistered: registeredEventIds.includes(event.id)
          }));
        } catch (error) {
          console.error('Error fetching registrations:', error);
          return events;
        }
      }
      
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
      });
      return [];
    }
  };

  const { data, isLoading, refetch } = useQuery<Event[]>({
    queryKey: ['events', user?.id],
    queryFn: fetchEvents
  });

  const handleRegistration = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsRegistering(eventId);

    try {
      // Check if already registered
      const event = data?.find(e => e.id === eventId);
      
      if (event?.isRegistered) {
        // Unregister from event
        const success = await RegistrationsAPI.unregister(user.id, eventId);
        
        if (!success) throw new Error("Failed to unregister");
        
        toast({
          title: "Registration Cancelled",
          description: `You have been unregistered from ${event.title}.`,
        });
      } else {
        // Register for event
        const success = await RegistrationsAPI.register(user.id, eventId);
        
        if (!success) throw new Error("Failed to register");
        
        const eventTitle = data?.find(e => e.id === eventId)?.title || 'event';
        toast({
          title: "Registration Successful",
          description: `You have been registered for ${eventTitle}. We look forward to seeing you!`,
        });
      }
      
      // Refresh the events data
      refetch();
    } catch (error: any) {
      console.error('Error handling registration:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Failed to process your registration. Please try again.",
      });
    } finally {
      setIsRegistering(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-spiritual-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-sanskrit text-spiritual-brown mb-4">Upcoming Events</h1>
            <p className="text-xl text-spiritual-brown/80 max-w-3xl mx-auto">
              Join our community for sacred ceremonies, meditations, and spiritual gatherings to nurture your soul.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="h-96 bg-white/50 animate-pulse">
                  <div className="h-full"></div>
                </Card>
              ))
            ) : (
              data?.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <div className="aspect-video bg-spiritual-sand/30 relative">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-spiritual-gold/90 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.price && (
                      <div className="absolute bottom-2 left-2 bg-spiritual-brown/80 text-white text-sm px-2 py-1 rounded">
                        {formatToRupees(event.price)}
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-sanskrit text-spiritual-brown">{event.title}</CardTitle>
                    <CardDescription className="flex items-center text-spiritual-brown/70">
                      <Clock className="h-4 w-4 mr-1" /> {event.time}
                    </CardDescription>
                    <CardDescription className="flex items-center text-spiritual-brown/70">
                      <MapPin className="h-4 w-4 mr-1" /> {event.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-spiritual-brown/80">{event.description}</p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${event.isRegistered 
                        ? 'bg-destructive hover:bg-destructive/90 text-white' 
                        : 'bg-spiritual-gold hover:bg-spiritual-gold/90 text-white'}`}
                      onClick={() => handleRegistration(event.id)}
                      disabled={isRegistering === event.id}
                    >
                      {isRegistering === event.id 
                        ? 'Processing...' 
                        : event.isRegistered 
                          ? 'Cancel Registration' 
                          : `Register for ${formatToRupees(event.price || 0)}`}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
