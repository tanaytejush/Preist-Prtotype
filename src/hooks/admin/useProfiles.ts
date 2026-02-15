
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/priest';
import { ProcessingState } from './types';

export const useProfiles = (processingState?: ProcessingState) => {
  const { toast } = useToast();
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  
  // Use either provided processing state or local one
  const isProcessing = processingState?.isProcessing || isLocalProcessing;
  const setIsProcessing = processingState?.setIsProcessing || setIsLocalProcessing;

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      try {
        console.log("Fetching profiles data...");
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        
        console.log("Profiles data fetched:", profiles);
        
        const profilesWithEmails = await Promise.all(profiles.map(async (profile) => {
          try {
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id);
            
            if (userError || !user) {
              console.log(`Couldn't fetch email for user ${profile.id}`, userError);
              return {
                ...profile,
                email: 'Unknown',
                is_priest: profile.is_priest || false,
                priest_status: profile.priest_status || null
              };
            }
            
            return {
              ...profile,
              email: user.email || 'Unknown',
              is_priest: profile.is_priest || false,
              priest_status: profile.priest_status || null
            };
          } catch (error) {
            console.error("Error fetching user email:", error);
            return {
              ...profile,
              email: 'Unknown',
              is_priest: profile.is_priest || false,
              priest_status: profile.priest_status || null
            };
          }
        }));
        
        console.log("Profiles with emails:", profilesWithEmails);
        return profilesWithEmails as UserProfile[];
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profiles",
        });
        return [] as UserProfile[];
      }
    }
  });

  const handleRefresh = async () => {
    setIsProcessing(true);
    await refetchProfiles();
    setIsProcessing(false);
    toast({
      title: "Refreshed",
      description: "User data has been updated"
    });
  };

  return {
    profiles,
    profilesLoading,
    isProcessing,
    setIsProcessing,
    refetchProfiles,
    handleRefresh
  };
};
