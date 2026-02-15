import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PriestProfile } from '@/types/priest';
import { useRazorpay } from '@/hooks/payment/useRazorpay';
import PriestReviews from '@/components/features/PriestReviews';
import { sendEmail } from '@/services/emailService';

interface BookingDetails {
  date: Date | undefined;
  time: string;
  purpose: string;
  address: string;
  additionalNotes: string;
}

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00"
];

const BookPriest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetails>({
    date: undefined,
    time: "",
    purpose: "",
    address: "",
    additionalNotes: ""
  });
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const { initiatePayment, isProcessing } = useRazorpay();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a priest for services.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const { data: priest, isLoading, error } = useQuery({
    queryKey: ['priest', id],
    queryFn: async () => {
      if (!id) throw new Error("Priest ID is required");
      
      // Try to fetch the priest profile from the database
      const { data: priestProfile, error } = await supabase
        .from('priest_profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error fetching priest:", error);
        // Fall back to mock data if there's an error
        return {
          id,
          user_id: "mock-user-id",
          name: "Swami Ananda",
          description: "Experienced priest specializing in traditional ceremonies and spiritual guidance.",
          specialties: ["Vedic Rituals", "Marriage Ceremonies", "Blessing Ceremonies"],
          experience_years: 15,
          avatar_url: "/placeholder.svg",
          base_price: 100,
          availability: "Weekdays 9am-5pm, Weekends by appointment",
          location: "Local Temple",
          rating: 4.8
        } as PriestProfile;
      }
      
      return priestProfile as PriestProfile;
    },
    enabled: !!id
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBooking(prev => ({
      ...prev,
      date
    }));
  };

  const handleTimeSelect = (time: string) => {
    setBooking(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a priest for services.",
        variant: "destructive",
      });
      return;
    }

    if (!booking.date || !booking.time || !booking.purpose || !booking.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const price = priest?.base_price || 0;

    const createBooking = async () => {
      const bookingDateTime = new Date(booking.date!);
      const [hours, minutes] = booking.time.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes);

      const { data: newBooking, error } = await supabase
        .from('priest_bookings')
        .insert({
          user_id: user.id,
          priest_id: id as string,
          booking_date: bookingDateTime.toISOString(),
          purpose: booking.purpose,
          address: booking.address,
          notes: booking.additionalNotes || null,
          price,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;
      return newBooking;
    };

    const sendBookingEmail = () => {
      if (user?.email) {
        sendEmail({
          type: 'booking_confirmation',
          to: user.email,
          data: {
            user_name: user.user_metadata?.first_name || 'Devotee',
            priest_name: priest?.name,
            purpose: booking.purpose,
            booking_date: booking.date ? format(booking.date, 'PPP') + ' at ' + booking.time : '',
            address: booking.address,
            price: priest?.base_price || 0,
            app_url: window.location.origin,
          },
        });
      }
    };

    if (price <= 0) {
      try {
        await createBooking();
        sendBookingEmail();
        toast({ title: "Booking Submitted", description: "Your booking has been submitted.", duration: 6000 });
        navigate('/profile?tab=bookings');
      } catch (error: any) {
        toast({ title: "Booking Failed", description: error.message || "There was an error.", variant: "destructive" });
      }
      return;
    }

    initiatePayment({
      amount: price,
      type: 'priest_booking',
      metadata: {
        priest_id: id,
        priest_name: priest?.name,
        purpose: booking.purpose,
        address: booking.address,
      },
      prefill: { email: user.email },
      onSuccess: async (paymentId) => {
        try {
          await createBooking();
          sendBookingEmail();
          toast({
            title: "Booking Confirmed",
            description: `Payment received (${paymentId}). Your booking with ${priest?.name} has been confirmed.`,
            duration: 6000,
          });
          navigate('/profile?tab=bookings');
        } catch (error: any) {
          toast({ title: "Booking Failed", description: "Payment succeeded but booking failed. Please contact support.", variant: "destructive" });
        }
      },
      onFailure: (error) => {
        if (error !== 'Payment was cancelled') {
          toast({ title: "Payment Failed", description: error, variant: "destructive" });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-spiritual-gold" />
            <p className="mt-4 text-lg text-spiritual-brown">Loading priest profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !priest) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
          <div className="text-center max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Priest</h2>
            <p className="text-gray-700">We encountered an issue while loading the priest profile. Please try again later.</p>
            <Button onClick={() => navigate('/priests')} className="mt-6" variant="spiritual">
              Back to Priests
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
      <div className="container mx-auto px-4 py-12 min-h-screen bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate('/priests')} 
            variant="outline" 
            className="mb-6"
          >
            &larr; Back to Priests
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="bg-white border-spiritual-gold/20 sticky top-6">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    <Avatar className="h-24 w-24 border-2 border-spiritual-gold">
                      <img 
                        src={priest?.avatar_url || '/placeholder.svg'} 
                        alt={priest?.name} 
                        className="object-cover"
                      />
                    </Avatar>
                  </div>
                  <CardTitle className="text-center text-spiritual-brown">{priest?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-spiritual-brown">Specialties</h4>
                      <p className="text-sm text-gray-600">{priest?.specialties.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-spiritual-brown">Experience</h4>
                      <p className="text-sm text-gray-600">{priest?.experience_years} years</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-spiritual-brown">Location</h4>
                      <p className="text-sm text-gray-600">{priest?.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-spiritual-brown">Base Price</h4>
                      <p className="text-sm text-gray-600">${priest?.base_price} per service</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-spiritual-brown">Availability</h4>
                      <p className="text-sm text-gray-600">{priest?.availability}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              {priest?.id && (
                <Card className="bg-white border-spiritual-gold/20 mt-4">
                  <CardHeader>
                    <CardTitle className="text-spiritual-brown text-base">Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PriestReviews priestId={priest.id} />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:col-span-2">
              <Card className="bg-white border-spiritual-gold/20">
                <CardHeader>
                  <CardTitle className="text-spiritual-brown">Book Services with {priest?.name}</CardTitle>
                  <CardDescription>
                    Fill in the details below to request services from this priest. Once confirmed, you'll be able to track your booking in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date">Select Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !booking.date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {booking.date ? format(booking.date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={booking.date}
                                onSelect={handleDateSelect}
                                initialFocus
                                disabled={(date) => 
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time">Select Time</Label>
                          <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !booking.time && "text-muted-foreground"
                                )}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {booking.time ? booking.time : <span>Select time</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="grid grid-cols-3 gap-2 py-2">
                                {timeSlots.map((time) => (
                                  <Button
                                    key={time}
                                    variant="ghost"
                                    className={cn(
                                      "justify-center",
                                      booking.time === time && "bg-spiritual-gold/20"
                                    )}
                                    onClick={() => {
                                      handleTimeSelect(time);
                                      setTimePopoverOpen(false);
                                    }}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="purpose">Purpose of Service</Label>
                        <Input
                          id="purpose"
                          name="purpose"
                          value={booking.purpose}
                          onChange={handleInputChange}
                          placeholder="e.g., House Blessing, Wedding Ceremony"
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Service Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={booking.address}
                          onChange={handleInputChange}
                          placeholder="Full address where the service will take place"
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          value={booking.additionalNotes}
                          onChange={handleInputChange}
                          placeholder="Any special requirements or additional information"
                          className="mt-1 min-h-[120px]"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-spiritual-brown font-medium">Service Fee:</span>
                        <span className="text-spiritual-brown font-bold text-lg">₹{priest?.base_price}</span>
                      </div>
                      
                      <Button
                        type="submit"
                        variant="spiritual"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
                        ) : (
                          'Pay & Book Now'
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Payment is processed securely via Razorpay. All payment methods (UPI, Cards, Net Banking) are supported.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookPriest;
