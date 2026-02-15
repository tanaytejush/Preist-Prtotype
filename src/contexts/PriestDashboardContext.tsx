
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PriestBooking } from '@/types/priest';
import { useToast } from '@/hooks/use-toast';

type PriestTab = 'schedule' | 'rituals' | 'teachings' | 'profile';

interface PriestDashboardContextType {
  activeTab: PriestTab;
  setActiveTab: React.Dispatch<React.SetStateAction<PriestTab>>;
  showAccessInstructions: boolean;
  setShowAccessInstructions: (show: boolean) => void;
  showHelpDialog: boolean;
  setShowHelpDialog: (show: boolean) => void;
  priestStatus: { is_priest: boolean; priest_status: string | null } | null;
  priestStatusLoading: boolean;
  priestProfile: any;
  priestProfileLoading: boolean;
  priestBookings: PriestBooking[];
  bookingsLoading: boolean;
  refreshPriestData: () => void;
}

const PriestDashboardContext = createContext<PriestDashboardContextType | undefined>(undefined);

export const PriestDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PriestTab>('schedule');
  const [showAccessInstructions, setShowAccessInstructions] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: priestStatus, isLoading: priestStatusLoading } = useQuery({
    queryKey: ['priest-status', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        console.log("Fetching priest status for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('is_priest, priest_status')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching priest status:", error);
          return { is_priest: false, priest_status: null };
        }
        
        console.log("Priest status result:", data);
        return data;
      } catch (err) {
        console.error("Error in priest status query:", err);
        return { is_priest: false, priest_status: null };
      }
    },
    enabled: !!user,
  });
  
  const { data: priestProfile, isLoading: priestProfileLoading } = useQuery({
    queryKey: ['priest-profile', user?.id],
    queryFn: async () => {
      // Allow access for admin users OR approved priests
      if (!user || (!isAdmin && !priestStatus?.is_priest)) return null;
      
      try {
        console.log("Fetching priest profile for user:", user.id);
        const { data, error } = await supabase
          .from('priest_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Changed from single() to maybeSingle() to prevent errors
        
        if (error) {
          console.error("Error fetching priest profile:", error);
          return null;
        }
        
        // If no profile exists but user is admin or approved priest, create one
        if (!data && (isAdmin || priestStatus?.is_priest)) {
          console.log("No priest profile found, creating one...");
          
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
            
          const name = userProfile ? 
            `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 
            'New Priest';
            
          const { data: newProfile, error: createError } = await supabase
            .from('priest_profiles')
            .insert({
              user_id: user.id,
              name: name || 'New Priest',
              description: 'Experienced priest specializing in traditional ceremonies.',
              specialties: ['Traditional Rituals', 'Meditation'],
              experience_years: 1,
              base_price: 100,
              avatar_url: '/placeholder.svg',
              availability: 'Weekends and evenings',
              location: 'Delhi'
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating priest profile:", createError);
            return null;
          }
          
          return newProfile;
        }
        
        console.log("Priest profile result:", data);
        return data;
      } catch (err) {
        console.error("Error in priest profile query:", err);
        return null;
      }
    },
    enabled: !!user && (!!priestStatus?.is_priest || !!isAdmin),
  });
  
  const { data: priestBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['priest-bookings', priestProfile?.id],
    queryFn: async () => {
      if (!priestProfile?.id) return [];
      
      try {
        console.log("Fetching bookings for priest:", priestProfile.id);
        const { data, error } = await supabase
          .from('priest_bookings')
          .select(`
            *,
            profiles:user_id (first_name, last_name, email)
          `)
          .eq('priest_id', priestProfile.id)
          .order('booking_date', { ascending: true });
        
        if (error) {
          console.error("Error fetching priest bookings:", error);
          return [];
        }
        
        console.log("Priest bookings result:", data);
        // Cast the data to PriestBooking[] to satisfy TypeScript
        return (data || []) as PriestBooking[];
      } catch (err) {
        console.error("Error in priest bookings query:", err);
        return [];
      }
    },
    enabled: !!priestProfile?.id,
  });
  
  useEffect(() => {
    if (user && (isAdmin || (priestStatus?.is_priest && priestStatus?.priest_status === 'approved'))) {
      toast({
        title: isAdmin ? "Admin Access: Priest Dashboard" : "Welcome to Priest Dashboard",
        description: "Manage your rituals, teachings, and schedule.",
      });
      
      if (!isAdmin) {
        const firstVisit = localStorage.getItem('priest_dashboard_visited') === null;
        if (firstVisit) {
          setShowAccessInstructions(true);
          localStorage.setItem('priest_dashboard_visited', 'true');
        }
      }
    }
  }, [user, priestStatus, toast, isAdmin]);
  
  const refreshPriestData = () => {
    queryClient.invalidateQueries({ queryKey: ['priest-status'] });
    queryClient.invalidateQueries({ queryKey: ['priest-profile'] });
    queryClient.invalidateQueries({ queryKey: ['priest-bookings'] });
  };

  return (
    <PriestDashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showAccessInstructions,
        setShowAccessInstructions,
        showHelpDialog,
        setShowHelpDialog,
        priestStatus,
        priestStatusLoading,
        priestProfile,
        priestProfileLoading,
        priestBookings: priestBookings || [],
        bookingsLoading,
        refreshPriestData
      }}
    >
      {children}
    </PriestDashboardContext.Provider>
  );
};

export const usePriestDashboard = () => {
  const context = useContext(PriestDashboardContext);
  if (context === undefined) {
    throw new Error('usePriestDashboard must be used within a PriestDashboardProvider');
  }
  return context;
};
