
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';
import { PriestBooking } from '@/types/priest';

interface RecentBookingsCardProps {
  bookings: PriestBooking[];
  onViewAll: () => void;
}

const RecentBookingsCard: React.FC<RecentBookingsCardProps> = ({ bookings, onViewAll }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-spiritual-gold" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="border-b pb-3 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{booking.purpose}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.address.substring(0, 50)}...
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No recent bookings.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-spiritual-gold" onClick={onViewAll}>
          View All Bookings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentBookingsCard;
