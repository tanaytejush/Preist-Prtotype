import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Plus, Trash2, Loader2, MapPin, Clock, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/common/use-toast';
import { EventsAPI } from '@/services/supabase/supabaseUtils';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  price?: number;
};

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number or zero.",
  }).optional(),
});

// Indian event images mapped to spiritual themes
const eventImages = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop", // Meditation
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop", // Fire ceremony
  "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop", // Scripture study
  "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?q=80&w=1000&auto=format&fit=crop", // Sound healing
  "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1000&auto=format&fit=crop", // Spiritual retreat
  "https://images.unsplash.com/photo-1604608672516-f1b9b1d91e46?q=80&w=1000&auto=format&fit=crop", // Temple celebration
];

// Indian Rupee formatter
const formatToRupees = (amount: number | undefined) => {
  if (amount === undefined) return '';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const EventsTab = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      imageUrl: "",
      price: 0,
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        date: editingEvent.date,
        time: editingEvent.time,
        location: editingEvent.location,
        description: editingEvent.description,
        imageUrl: editingEvent.imageUrl || "",
        price: editingEvent.price || 0,
      });
    } else {
      form.reset({
        title: "",
        date: new Date().toISOString().split('T')[0],
        time: "",
        location: "",
        description: "",
        imageUrl: "",
        price: 0,
      });
    }
  }, [editingEvent, form]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await EventsAPI.getAll();
      
      // Add default images to events without images
      const eventsWithImages = data.map((event, index) => {
        if (!event.imageUrl || event.imageUrl === "/placeholder.svg") {
          return {
            ...event,
            imageUrl: eventImages[index % eventImages.length]
          };
        }
        return event;
      });
      
      setEvents(eventsWithImages);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewEvent = () => {
    setEditingEvent(null);
    setOpenDialog(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setOpenDialog(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setIsDeleting(eventId);
      const success = await EventsAPI.delete(eventId);
      
      if (success) {
        setEvents(events.filter(event => event.id !== eventId));
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete the event");
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message || "Failed to delete the event. Please try again.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // If no image URL is provided, assign one from our collection
      if (!values.imageUrl || values.imageUrl.trim() === '') {
        const randomIndex = Math.floor(Math.random() * eventImages.length);
        values.imageUrl = eventImages[randomIndex];
      }
      
      if (editingEvent) {
        // Update existing event
        const success = await EventsAPI.update(editingEvent.id, values);
        
        if (success) {
          setEvents(events.map(event => 
            event.id === editingEvent.id ? { ...event, ...values } : event
          ));
          
          toast({
            title: "Event Updated",
            description: "The event has been successfully updated.",
          });
        } else {
          throw new Error("Failed to update the event");
        }
      } else {
        // Create new event - ensure we provide all required fields
        const newEventData = {
          title: values.title,
          date: values.date,
          time: values.time,
          location: values.location,
          description: values.description,
          imageUrl: values.imageUrl,
          price: values.price
        };
        
        const newEvent = await EventsAPI.create(newEventData);
        
        if (newEvent) {
          setEvents([...events, newEvent]);
          
          toast({
            title: "Event Created",
            description: "The new event has been successfully added.",
          });
        } else {
          throw new Error("Failed to create the event");
        }
      }
      
      setOpenDialog(false);
      form.reset();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save the event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <CardDescription>Manage upcoming and past events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button 
            className="bg-spiritual-gold hover:bg-spiritual-gold/90" 
            onClick={handleAddNewEvent}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Event
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-spiritual-gold" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No events found. Create your first event with the button above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/50 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Event Image */}
                    <div className="w-full sm:w-24 h-24 bg-spiritual-sand/30 rounded-md overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-spiritual-brown text-lg mb-1">{event.title}</h3>
                      <div className="flex flex-wrap gap-x-4 text-sm text-spiritual-brown/70">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {event.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {event.location}
                        </span>
                        {event.price !== undefined && (
                          <span className="flex items-center font-medium text-spiritual-brown">
                            <IndianRupee className="h-3 w-3 mr-1" /> {formatToRupees(event.price)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-spiritual-brown/80 line-clamp-2">{event.description}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditEvent(event)}
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive w-full"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={isDeleting === event.id}
                      >
                        {isDeleting === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Event Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent 
                ? 'Update the details of this event.' 
                : 'Fill out the form below to create a new event.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Sacred Fire Ceremony" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="5:30 AM - 7:00 AM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Riverside Sanctuary, Rishikesh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="500"
                          min="0"
                          step="50"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Leave blank for default image" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A traditional fire ceremony (havan) to purify the atmosphere and invoke divine blessings."
                          className="resize-none min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-spiritual-gold hover:bg-spiritual-gold/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      {editingEvent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventsTab;
