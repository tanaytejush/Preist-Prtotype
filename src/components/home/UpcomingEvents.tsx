
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EventsAPI, Event } from '@/api/supabaseUtils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

const UpcomingEvents = () => {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const allEvents = await EventsAPI.getAll();
      // Return the first 3 events or use mock data if no events are found
      if (allEvents.length > 0) {
        return allEvents.slice(0, 3);
      }
      
      // Mock data as fallback
      return [
        {
          id: "1",
          title: "Navratri Celebration",
          date: "October 7-15, 2023",
          time: "6:00 PM - 9:00 PM",
          location: "Temple Gardens, Delhi",
          description: "Join us for nine nights of devotion, music, and dance honoring the divine feminine energy.",
          imageUrl: "https://images.unsplash.com/photo-1604608672516-f1b9b1d91e46?q=80&w=1000&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          title: "Meditation Retreat",
          date: "November 5-7, 2023",
          time: "All Day",
          location: "Rishikesh Sanctuary",
          description: "A weekend of deep meditation, yoga practices, and spiritual teachings by the sacred Ganges.",
          imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
          title: "Bhagavad Gita Discourse",
          date: "November 15, 2023",
          time: "6:30 PM - 8:00 PM",
          location: "Community Hall, Mumbai",
          description: "An enlightening talk on finding purpose and meaning through the timeless wisdom of the Gita.",
          imageUrl: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground font-sanskrit mb-2">Upcoming Events</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join our community for these special gatherings designed to nurture your spiritual growth
          and foster connections with like-minded seekers.
        </p>
        <div className="mehndi-divider mx-auto max-w-xs"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="indian-card p-6 hover:shadow-lg transition-all duration-300 card-3d">
            <AspectRatio ratio={16/9} className="mb-4 overflow-hidden rounded-lg">
              <img 
                src={event.imageUrl || "/placeholder.svg"} 
                alt={event.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" 
              />
            </AspectRatio>
            
            <div className="flex items-start mb-4">
              <div className="bg-spiritual-saffron/10 p-3 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-spiritual-saffron" />
              </div>
              <div>
                <h3 className="text-xl font-sanskrit text-foreground">{event.title}</h3>
                <p className="text-muted-foreground">{event.date}</p>
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <p className="text-foreground mt-3">{event.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <Link to={`/events/${event.id}`} className="indian-link">
                Read more
              </Link>
              <Link to="/events" className="bg-spiritual-saffron/10 text-spiritual-saffron hover:bg-spiritual-saffron/20 px-4 py-2 rounded-md transition-colors duration-300 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                RSVP
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="spiritual" asChild>
          <Link to="/events">View All Events</Link>
        </Button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
