
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, Navigation } from 'lucide-react';
import { PriestBooking } from '@/types/priest';
import PriestLocationTracker from '@/components/priest/PriestLocationTracker';

interface ScheduleCardProps {
  todaysBookings: PriestBooking[];
  onViewFullSchedule: () => void;
  priestId?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ todaysBookings, onViewFullSchedule, priestId }) => {
  const confirmedBookings = todaysBookings.filter(booking => booking.status === 'confirmed');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-spiritual-gold" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {todaysBookings.length > 0 ? (
            <ul className="space-y-4">
              {todaysBookings.map((booking) => (
                <li key={booking.id} className="border-b pb-2 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{booking.purpose}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(booking.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.address}
                      </div>
                    </div>
                    {booking.status === 'confirmed' && (
                      <div className="flex items-center text-xs">
                        <Navigation className="h-3 w-3 mr-1 text-green-500" />
                        <span className={booking.priest_started_journey ? "text-green-600" : "text-amber-600"}>
                          {booking.priest_started_journey ? "En Route" : "Ready"}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No bookings scheduled for today.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-spiritual-gold" onClick={onViewFullSchedule}>
            View Full Schedule
          </Button>
        </CardFooter>
      </Card>

      {/* Location Tracking for Active Bookings */}
      {confirmedBookings.length > 0 && priestId && (
        <div className="space-y-4">
          {confirmedBookings.map((booking) => (
            <PriestLocationTracker
              key={booking.id}
              booking={booking}
              priestId={priestId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
