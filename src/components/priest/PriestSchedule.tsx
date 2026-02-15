
import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

// Sample schedule data
const scheduleEvents = [
  {
    id: "1",
    title: "Morning Puja",
    date: "2025-04-07",
    time: "6:00 AM - 7:30 AM", 
    location: "Main Temple Hall",
    type: "ritual",
  },
  {
    id: "2",
    title: "Vedic Chanting Session",
    date: "2025-04-07", 
    time: "10:00 AM - 11:30 AM",
    location: "Meditation Room",
    type: "teaching",
  },
  {
    id: "3", 
    title: "Private Ceremony",
    date: "2025-04-08",
    time: "4:00 PM - 6:00 PM",
    location: "Family Residence, Sector 23",
    type: "ceremony",
  },
  {
    id: "4",
    title: "Evening Aarti",
    date: "2025-04-08",
    time: "6:30 PM - 7:30 PM",
    location: "Main Temple Hall",
    type: "ritual",
  },
  {
    id: "5",
    title: "Spiritual Guidance Session",
    date: "2025-04-09",
    time: "11:00 AM - 1:00 PM",
    location: "Counseling Room 2",
    type: "consultation",
  },
  {
    id: "6",
    title: "Bhagavad Gita Class",
    date: "2025-04-10",
    time: "5:00 PM - 6:30 PM",
    location: "Community Hall",
    type: "teaching",
  }
];

const typeColors: Record<string, string> = {
  ritual: "bg-amber-100 text-amber-800 border-amber-200",
  teaching: "bg-sky-100 text-sky-800 border-sky-200",
  ceremony: "bg-purple-100 text-purple-800 border-purple-200",
  consultation: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const PriestSchedule = () => {
  const [filter, setFilter] = useState('all');
  
  // Get unique dates for grouping
  const dates = [...new Set(scheduleEvents.map(event => event.date))];
  
  // Filter events based on selection
  const filteredEvents = filter === 'all' 
    ? scheduleEvents 
    : scheduleEvents.filter(event => event.type === filter);
  
  return (
    <div>
      <div className="flex flex-wrap gap-4 items-center mb-6 justify-between">
        <h2 className="text-2xl font-sanskrit text-spiritual-brown dark:text-spiritual-cream">Your Schedule</h2>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="ritual">Rituals</SelectItem>
              <SelectItem value="teaching">Teachings</SelectItem>
              <SelectItem value="ceremony">Ceremonies</SelectItem>
              <SelectItem value="consultation">Consultations</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="ml-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {dates.map(date => {
          const dateEvents = filteredEvents.filter(event => event.date === date);
          
          // Skip dates with no matching events after filtering
          if (dateEvents.length === 0) return null;
          
          return (
            <div key={date} className="space-y-3">
              <h3 className="font-medium text-lg flex items-center text-spiritual-brown dark:text-spiritual-cream">
                <CalendarIcon className="h-5 w-5 mr-2 text-spiritual-gold" />
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dateEvents.map(event => (
                  <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className={`text-xs ${typeColors[event.type]}`}>
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {event.location}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No scheduled events match your filter.</p>
            <Button 
              variant="link" 
              onClick={() => setFilter('all')} 
              className="mt-2 text-spiritual-gold"
            >
              Show all events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriestSchedule;
