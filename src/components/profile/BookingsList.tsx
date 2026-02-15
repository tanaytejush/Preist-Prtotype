
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Eye, Navigation, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PriestBooking } from '@/types/priest';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ReviewForm from '@/components/features/ReviewForm';

interface BookingsListProps {
  bookings: PriestBooking[];
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);

  // Fetch existing reviews for the user's bookings
  const { data: existingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('reviews')
        .select('booking_id')
        .eq('user_id', user.id);
      return data?.map((r: any) => r.booking_id) || [];
    },
    enabled: !!user,
  });

  const hasReview = (bookingId: string) => existingReviews?.includes(bookingId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const canTrackBooking = (booking: PriestBooking) => {
    return booking.status === 'confirmed' || booking.priest_started_journey;
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 mb-4">You haven't made any priest bookings yet.</p>
          <Button onClick={() => navigate('/priests')} className="bg-spiritual-gold hover:bg-spiritual-gold/90">
            Browse Priests
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{booking.purpose}</CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusBadge(booking.status)}
                {booking.priest_started_journey && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Navigation className="h-3 w-3 mr-1" />
                    En Route
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-spiritual-gold" />
                  <span className="text-sm">{formatDate(booking.booking_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-spiritual-gold" />
                  <span className="text-sm">{booking.address}</span>
                </div>
                <div className="text-sm">
                  <strong>Price:</strong> ₹{booking.price}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {booking.notes && (
                  <div>
                    <strong className="text-sm">Notes:</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{booking.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-auto">
                  {canTrackBooking(booking) && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/track-booking/${booking.id}`)}
                      className="bg-spiritual-gold hover:bg-spiritual-gold/90"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Track Booking
                    </Button>
                  )}
                  {booking.status === 'completed' && booking.id && !hasReview(booking.id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={() => setReviewingBookingId(
                        reviewingBookingId === booking.id ? null : booking.id!
                      )}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Leave Review
                    </Button>
                  )}
                  {booking.status === 'completed' && booking.id && hasReview(booking.id) && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Reviewed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {reviewingBookingId === booking.id && booking.id && user && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ReviewForm
                  priestId={booking.priest_id}
                  bookingId={booking.id}
                  userId={user.id}
                  onReviewSubmitted={() => {
                    setReviewingBookingId(null);
                    refetchReviews();
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
