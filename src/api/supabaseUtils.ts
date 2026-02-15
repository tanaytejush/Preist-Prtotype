import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PriestProfile } from '@/types/priest';

// Types
export type EventRegistration = {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  updated_at: string;
};

export type ServiceBooking = {
  id: string;
  user_id: string;
  service_id: string;
  booking_date: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  price?: number;  // Added price property
  isRegistered?: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  created_at: string;
};

export type Teaching = {
  id: string;
  title: string;
  author: string;
  date: string;
  description: string;
  category: string;
  content: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
};

// Event Operations
export const EventsAPI = {
  getAll: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) throw error;
      return data as unknown as Event[] || [];
    } catch (error) {
      console.error('Error fetching all events:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as unknown as Event;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
          imageurl: event.imageUrl
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Map the returned data to our Event type
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        description: data.description,
        imageUrl: data.imageurl,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },
  
  update: async (id: string, event: Partial<Event>): Promise<boolean> => {
    try {
      // Map from our Event type to the database column names
      const dbEvent: any = { ...event };
      if (event.imageUrl) {
        dbEvent.imageurl = event.imageUrl;
        delete dbEvent.imageUrl;
      }
      
      const { error } = await supabase
        .from('events')
        .update(dbEvent)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      return false;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      return false;
    }
  }
};

// Registration Operations
export const RegistrationsAPI = {
  register: async (userId: string, eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: userId,
          event_id: eventId
        });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      return false;
    }
  },
  
  unregister: async (userId: string, eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .match({ user_id: userId, event_id: eventId });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      return false;
    }
  },
  
  getByUserId: async (userId: string): Promise<EventRegistration[]> => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data as unknown as EventRegistration[] || [];
    } catch (error) {
      console.error(`Error fetching registrations for user ${userId}:`, error);
      return [];
    }
  },
  
  getByEventId: async (eventId: string): Promise<EventRegistration[]> => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId);
        
      if (error) throw error;
      return data as unknown as EventRegistration[] || [];
    } catch (error) {
      console.error(`Error fetching registrations for event ${eventId}:`, error);
      return [];
    }
  },
  
  checkRegistration: async (userId: string, eventId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .match({ user_id: userId, event_id: eventId });
        
      if (error) throw error;
      return (data && data.length > 0);
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
    }
  }
};

// Service Operations
export const ServicesAPI = {
  getAll: async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) throw error;
      return data as unknown as Service[] || [];
    } catch (error) {
      console.error('Error fetching all services:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as unknown as Service;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          title: service.title,
          description: service.description,
          duration: service.duration,
          price: service.price,
          icon: service.icon
        })
        .select()
        .single();
        
      if (error) throw error;
      return data as unknown as Service;
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  },
  
  update: async (id: string, service: Partial<Service>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      return false;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      return false;
    }
  }
};

// Booking Operations
export const BookingsAPI = {
  book: async (
    userId: string, 
    serviceId: string, 
    bookingDate: string, 
    notes?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .insert({
          user_id: userId,
          service_id: serviceId,
          booking_date: bookingDate,
          notes: notes || null
        });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error booking service:', error);
      return false;
    }
  },
  
  cancel: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error cancelling booking with ID ${id}:`, error);
      return false;
    }
  },
  
  getByUserId: async (userId: string): Promise<ServiceBooking[]> => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('user_id', userId)
        .order('booking_date', { ascending: true });
        
      if (error) throw error;
      return data as unknown as ServiceBooking[] || [];
    } catch (error) {
      console.error(`Error fetching bookings for user ${userId}:`, error);
      return [];
    }
  },
  
  getByServiceId: async (serviceId: string): Promise<ServiceBooking[]> => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('service_id', serviceId)
        .order('booking_date', { ascending: true });
        
      if (error) throw error;
      return data as unknown as ServiceBooking[] || [];
    } catch (error) {
      console.error(`Error fetching bookings for service ${serviceId}:`, error);
      return [];
    }
  },
  
  updateStatus: async (id: string, status: ServiceBooking['status']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for booking ${id}:`, error);
      return false;
    }
  }
};

// Contact Submissions Operations
export const ContactAPI = {
  getAll: async (): Promise<ContactSubmission[]> => {
    try {
      // Use a type assertion to work around TypeScript limitations
      // with the dynamically created table
      const { data, error } = await (supabase as any)
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as ContactSubmission[] || [];
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return [];
    }
  },
  
  updateStatus: async (id: string, status: ContactSubmission['status']): Promise<boolean> => {
    try {
      // Use a type assertion to work around TypeScript limitations
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating contact submission status:`, error);
      return false;
    }
  }
};

// Teachings Operations
export const TeachingsAPI = {
  getAll: async (): Promise<Teaching[]> => {
    try {
      // Use a type assertion to work around TypeScript limitations
      const { data, error } = await (supabase as any)
        .from('teachings')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data as Teaching[] || [];
    } catch (error) {
      console.error('Error fetching all teachings:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Teaching | null> => {
    try {
      // Use a type assertion to work around TypeScript limitations
      const { data, error } = await (supabase as any)
        .from('teachings')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Teaching;
    } catch (error) {
      console.error(`Error fetching teaching with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (teaching: Omit<Teaching, 'id' | 'created_at' | 'updated_at'>): Promise<Teaching | null> => {
    try {
      // Map from our Teaching type to the database column names
      const dbTeaching: any = { ...teaching };
      if (teaching.imageUrl) {
        dbTeaching.imageurl = teaching.imageUrl;
        delete dbTeaching.imageUrl;
      }
      
      const { data, error } = await (supabase as any)
        .from('teachings')
        .insert(dbTeaching)
        .select()
        .single();
        
      if (error) throw error;
      
      // Map the returned data back to our Teaching type
      return {
        id: data.id,
        title: data.title,
        author: data.author,
        date: data.date,
        description: data.description,
        category: data.category,
        content: data.content,
        imageUrl: data.imageurl || '/placeholder.svg',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating teaching:', error);
      return null;
    }
  },
  
  update: async (id: string, teaching: Partial<Teaching>): Promise<boolean> => {
    try {
      // Map from our Teaching type to the database column names
      const dbTeaching: any = { ...teaching };
      if (teaching.imageUrl) {
        dbTeaching.imageurl = teaching.imageUrl;
        delete dbTeaching.imageUrl;
      }
      
      const { error } = await (supabase as any)
        .from('teachings')
        .update(dbTeaching)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating teaching with ID ${id}:`, error);
      return false;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('teachings')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting teaching with ID ${id}:`, error);
      return false;
    }
  }
};

// User's Profile Operations
export const ProfileAPI = {
  getProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  updateProfile: async (userId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }
};

// Priest Profile Operations
export const PriestAPI = {
  getProfile: async (userId: string): Promise<PriestProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('priest_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      return data as unknown as PriestProfile;
    } catch (error) {
      console.error(`Error fetching priest profile for user ${userId}:`, error);
      return null;
    }
  },
  
  getAllProfiles: async (): Promise<PriestProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('priest_profiles')
        .select('*');
        
      if (error) throw error;
      return data as unknown as PriestProfile[] || [];
    } catch (error) {
      console.error('Error fetching all priest profiles:', error);
      return [];
    }
  },
  
  createProfile: async (profile: Omit<PriestProfile, 'id' | 'created_at' | 'updated_at'>): Promise<PriestProfile | null> => {
    try {
      console.log("Creating priest profile with data:", profile);
      
      // Ensure all required fields are present
      const completeProfile = {
        user_id: profile.user_id,
        name: profile.name || 'New Priest',
        description: profile.description || 'Experienced priest specializing in traditional ceremonies.',
        specialties: profile.specialties || ['Traditional Rituals'],
        experience_years: profile.experience_years || 1,
        base_price: profile.base_price || 100,
        avatar_url: profile.avatar_url || '/placeholder.svg',
        availability: profile.availability || 'Weekends and evenings',
        location: profile.location || 'Delhi'
      };
      
      const { data, error } = await supabase
        .from('priest_profiles')
        .insert(completeProfile)
        .select()
        .single();
        
      if (error) {
        console.error("Error in createProfile:", error);
        throw error;
      }
      console.log("Created priest profile:", data);
      return data as unknown as PriestProfile;
    } catch (error: any) {
      console.error("Error creating priest profile:", error);
      throw error;
    }
  },
  
  updateProfile: async (id: string, updates: Partial<PriestProfile>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('priest_profiles')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating priest profile with ID ${id}:`, error);
      return false;
    }
  }
};
