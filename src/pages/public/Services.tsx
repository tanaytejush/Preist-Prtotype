
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/common/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ServicesAPI, BookingsAPI, Service } from '@/services/supabase/supabaseUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, Clock, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useRazorpay } from '@/hooks/payment/useRazorpay';

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your booking.",
  }),
  notes: z.string().optional(),
});

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiatePayment, isProcessing } = useRazorpay();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const data = await ServicesAPI.getAll();
      
      if (data.length === 0) {
        return [
          {
            id: "1",
            title: "Spiritual Consultation",
            description: "A one-on-one session with the priest to discuss personal spiritual concerns, receive guidance, and find clarity on life challenges.",
            duration: "60 minutes",
            price: "$75",
            icon: "🙏",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            title: "Home Blessing Ceremony",
            description: "A sacred ritual to purify your living space, remove negative energies, and invite prosperity and harmony into your home.",
            duration: "90 minutes",
            price: "$120",
            icon: "🏠",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            title: "Marriage Ceremony",
            description: "A beautiful, traditional ceremony to unite two souls in the sacred bond of marriage, with personalized vows and rituals.",
            duration: "2-3 hours",
            price: "$350",
            icon: "💍",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "4",
            title: "Baby Naming & Blessing",
            description: "A joyous ceremony to welcome a new soul into the world, with name selection based on astrological considerations and blessings for a prosperous life.",
            duration: "60 minutes",
            price: "$95",
            icon: "👶",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "5",
            title: "Healing Ritual",
            description: "A powerful ceremony that combines ancient practices to promote physical, emotional, and spiritual healing.",
            duration: "75 minutes",
            price: "$90",
            icon: "✨",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "6",
            title: "Meditation Guidance",
            description: "Learn personalized meditation techniques suited to your spiritual needs and temperament.",
            duration: "60 minutes",
            price: "$65",
            icon: "🧘",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "7",
            title: "Prayer for Ancestors",
            description: "Honor your ancestors and seek their blessings through traditional prayers and rituals.",
            duration: "45 minutes",
            price: "$60",
            icon: "🕯️",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "8",
            title: "Annual Festival Celebration",
            description: "Join the community in celebrating major religious festivals with traditional rituals, singing, and feasting.",
            duration: "3-4 hours",
            price: "Donation based",
            icon: "🎉",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ];
      }
      
      return data;
    }
  });

  const handleBookNow = (service: Service) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a service.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setSelectedService(service);
    setOpenDialog(true);
    form.reset({
      date: undefined,
      notes: ""
    });
  };

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedService || !user) return;

    const price = parsePrice(selectedService.price);
    if (price <= 0) {
      // Donation-based or free services — book directly without payment
      try {
        const bookingDate = values.date.toISOString();
        const success = await BookingsAPI.book(user.id, selectedService.id, bookingDate, values.notes);
        if (!success) throw new Error("Failed to book the service");
        toast({
          title: "Booking Successful",
          description: `Your ${selectedService.title} service has been booked for ${format(values.date, 'PPPP')}.`,
        });
        setOpenDialog(false);
        form.reset();
      } catch (error: any) {
        toast({ variant: "destructive", title: "Booking Failed", description: error.message || "Failed to book the service." });
      }
      return;
    }

    initiatePayment({
      amount: price,
      type: 'service_booking',
      metadata: {
        service_id: selectedService.id,
        service_title: selectedService.title,
        booking_date: values.date.toISOString(),
        notes: values.notes,
      },
      prefill: { email: user.email },
      onSuccess: async (paymentId) => {
        try {
          const bookingDate = values.date.toISOString();
          const success = await BookingsAPI.book(user.id, selectedService.id, bookingDate, values.notes);
          if (!success) throw new Error("Failed to book the service");
          toast({
            title: "Booking Successful",
            description: `Payment received (${paymentId}). Your ${selectedService.title} service has been booked for ${format(values.date, 'PPPP')}.`,
          });
          setOpenDialog(false);
          form.reset();
        } catch (error: any) {
          toast({ variant: "destructive", title: "Booking Failed", description: "Payment was successful but booking failed. Please contact support." });
        }
      },
      onFailure: (error) => {
        if (error !== 'Payment was cancelled') {
          toast({ variant: "destructive", title: "Payment Failed", description: error });
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Improved Visual */}
        <div className="relative py-10 bg-spiritual-cream">
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb')] bg-cover bg-center h-64 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-b from-spiritual-brown/30 to-spiritual-brown/60 backdrop-blur-sm"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pb-24 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-sanskrit mb-4 animate-fade-in">Sacred Services</h1>
              <p className="text-white/90 max-w-3xl mx-auto text-lg">
                Discover our range of spiritual services designed to support your journey toward inner peace, 
                balance, and connection with the divine.
              </p>
              <Button className="mt-6" variant="spiritual">
                View Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Services Grid with Enhanced Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            {error && (
              <div className="text-center py-10 mb-8 spiritual-card">
                <p className="text-destructive font-medium mb-2">Failed to load services</p>
                <p className="text-muted-foreground mb-4">Something went wrong while fetching services.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="spiritual-card h-[300px] animate-pulse bg-gray-100 dark:bg-gray-800"></div>
                ))
              ) : (
                services.map((service) => (
                  <div 
                    key={service.id} 
                    className="spiritual-card hover:shadow-lg transition-all duration-300 border border-spiritual-gold/10 hover:border-spiritual-gold/30 group relative overflow-hidden"
                  >
                    <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-spiritual-gold/5 group-hover:bg-spiritual-gold/10 transition-all duration-500"></div>
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4 bg-spiritual-cream/50 dark:bg-gray-800/50 p-3 rounded-full">{service.icon}</div>
                      <h3 className="text-xl font-sanskrit text-spiritual-brown dark:text-spiritual-cream">{service.title}</h3>
                    </div>
                    <p className="text-spiritual-brown/80 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>
                    <div className="flex justify-between text-sm text-spiritual-brown/70 dark:text-gray-400 mb-5 border-t border-spiritual-gold/10 dark:border-gray-700 pt-4">
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {service.duration}</span>
                      <span className="flex items-center"><DollarSign className="h-4 w-4 mr-1" /> {service.price}</span>
                    </div>
                    <Button
                      variant="spiritual"
                      className="w-full transition-all duration-300 group-hover:shadow-md"
                      onClick={() => handleBookNow(service)}
                    >
                      Book Now
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {/* Custom Service Call to Action */}
            <div className="mt-16 spiritual-card text-center bg-gradient-to-r from-spiritual-cream/50 to-spiritual-gold/10 dark:from-gray-800/50 dark:to-gray-800/80">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-sanskrit text-spiritual-brown dark:text-spiritual-cream mb-4">Need a Custom Service?</h2>
                <p className="text-spiritual-brown/80 dark:text-gray-300 mb-6">
                  If you don't see the specific service you're looking for, or if you need a customized ceremony 
                  for a special occasion, please don't hesitate to reach out. We're happy to create a personalized 
                  experience that meets your spiritual needs.
                </p>
                <Link to="/contact">
                  <Button variant="spiritual" className="inline-block">
                    Request Custom Service
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* How It Works Section with Improved Visuals */}
            <div className="mt-16">
              <h2 className="text-2xl font-sanskrit text-spiritual-brown dark:text-spiritual-cream text-center mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="spiritual-card text-center relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-spiritual-gold/10 group-hover:bg-spiritual-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                    <span className="font-sanskrit text-spiritual-gold text-2xl">1</span>
                  </div>
                  <h3 className="font-sanskrit text-spiritual-brown dark:text-spiritual-cream mb-2">Book Your Service</h3>
                  <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm">
                    Choose your desired service and select a convenient date and time.
                  </p>
                </div>
                
                <div className="spiritual-card text-center relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-spiritual-gold/10 group-hover:bg-spiritual-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                    <span className="font-sanskrit text-spiritual-gold text-2xl">2</span>
                  </div>
                  <h3 className="font-sanskrit text-spiritual-brown dark:text-spiritual-cream mb-2">Confirmation</h3>
                  <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm">
                    Receive a confirmation email with all the details and preparation instructions.
                  </p>
                </div>
                
                <div className="spiritual-card text-center relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-spiritual-gold/10 group-hover:bg-spiritual-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                    <span className="font-sanskrit text-spiritual-gold text-2xl">3</span>
                  </div>
                  <h3 className="font-sanskrit text-spiritual-brown dark:text-spiritual-cream mb-2">Experience</h3>
                  <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm">
                    Participate in your chosen service, either in-person or virtually.
                  </p>
                </div>
                
                <div className="spiritual-card text-center relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-spiritual-gold/10 group-hover:bg-spiritual-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                    <span className="font-sanskrit text-spiritual-gold text-2xl">4</span>
                  </div>
                  <h3 className="font-sanskrit text-spiritual-brown dark:text-spiritual-cream mb-2">Follow-up</h3>
                  <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm">
                    Receive post-service guidance and resources to continue your spiritual journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer className="w-full" />

      {/* Enhanced Booking Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="bg-spiritual-gold/10 p-6">
            <DialogHeader>
              <DialogTitle className="font-sanskrit text-spiritual-brown dark:text-spiritual-cream text-2xl flex items-center">
                {selectedService?.icon && <span className="mr-2 text-2xl">{selectedService.icon}</span>}
                Book {selectedService?.title}
              </DialogTitle>
              <DialogDescription>
                Select a date for your booking and provide any additional information.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-medium">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal flex justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto border rounded-md shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific requirements or information we should know?"
                          className="resize-none focus:ring-2 focus:ring-spiritual-gold/30 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedService && (
                  <div className="bg-spiritual-cream/30 dark:bg-gray-800/30 p-3 rounded-md flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-spiritual-brown dark:text-spiritual-cream">Service Details:</p>
                      <p className="text-spiritual-brown/70 dark:text-gray-300">{selectedService.duration} | {selectedService.price}</p>
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-6 pt-4 border-t border-spiritual-gold/10 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpenDialog(false)}
                    className="mt-2 sm:mt-0"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="spiritual"
                    className="mt-2 sm:mt-0"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      'Book Service'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
