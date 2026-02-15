
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookingsAPI, ServicesAPI } from '@/api/supabaseUtils';
import { Calendar, Clock, User, FileText, BadgeCheck, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';

type Service = {
  id: string;
  title: string;
};

type BookingWithService = {
  id: string;
  user_id: string;
  service_id: string;
  booking_date: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  service?: Service;
  user_name?: string;
};

const BookingsTab = () => {
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const allServices = await ServicesAPI.getAll();
      setServices(allServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // Fetch all bookings
      const allBookings: BookingWithService[] = [];
      
      // Get all services to join with bookings
      const allServices = await ServicesAPI.getAll();
      
      // For each service, get bookings
      for (const service of allServices) {
        const serviceBookings = await BookingsAPI.getByServiceId(service.id);
        
        // Add service details to each booking
        const bookingsWithService = serviceBookings.map(booking => ({
          ...booking,
          service: {
            id: service.id,
            title: service.title
          },
          // Format date for display
          booking_date: new Date(booking.booking_date).toISOString(),
          user_name: `User ${booking.user_id.substring(0, 5)}...` // Placeholder for real names
        }));
        
        allBookings.push(...bookingsWithService);
      }
      
      // Sort by booking date (most recent first)
      const sortedBookings = allBookings.sort((a, b) => 
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
      );
      
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      setUpdatingBookingId(id);
      const success = await BookingsAPI.updateStatus(id, status);
      
      if (success) {
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        ));
        
        toast({
          title: "Status Updated",
          description: `Booking status changed to ${status}`,
        });
      } else {
        throw new Error("Failed to update booking status");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the booking status",
      });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Bookings</CardTitle>
        <CardDescription>Manage all service bookings from users</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-spiritual-gold" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No bookings found yet.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.service?.title || "Unknown Service"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {format(new Date(booking.booking_date), 'PPP')}
                        </span>
                        <span className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(booking.booking_date), 'p')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {booking.user_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.notes ? (
                        <div className="flex items-start">
                          <FileText className="h-3.5 w-3.5 mr-1 mt-0.5 text-muted-foreground" />
                          <span className="text-sm line-clamp-2">{booking.notes}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No notes</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={updatingBookingId === booking.id}
                            >
                              {updatingBookingId === booking.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                              )}
                              <span>Confirm</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              disabled={updatingBookingId === booking.id}
                            >
                              {updatingBookingId === booking.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-3.5 w-3.5 mr-1" />
                              )}
                              <span>Cancel</span>
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            disabled={updatingBookingId === booking.id}
                          >
                            {updatingBookingId === booking.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                            )}
                            <span>Mark Complete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsTab;
