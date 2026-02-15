
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProcessingState, ProfilesState } from './types';
import { usePriestProfile } from './usePriestProfile';
import { useQueryClient } from '@tanstack/react-query';

export const usePriestStatus = (
  processingState: ProcessingState,
  profilesState: ProfilesState
) => {
  const { toast } = useToast();
  const { setIsProcessing } = processingState;
  const { refetchProfiles } = profilesState;
  const { createPriestProfile } = usePriestProfile();
  const queryClient = useQueryClient();

  // Function for priest approval with improved refresh mechanism
  const handlePriestApproval = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      setIsProcessing(true);
      console.log(`Approving priest with ID ${userId}, setting status to: ${status}`);
      
      // Update profile status directly in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          priest_status: status,
          is_priest: status === 'approved'
        })
        .eq('id', userId);

      if (error) {
        console.error("Error updating priest status:", error);
        throw error;
      }

      console.log("Profile updated successfully with status:", status);
      
      // If approving, create priest profile record
      if (status === 'approved') {
        try {
          console.log("Creating priest profile for user:", userId);
          await createPriestProfile(userId);
          console.log("Priest profile created successfully");
        } catch (profileError) {
          console.error("Error creating priest profile:", profileError);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Priest status updated but profile creation had an issue",
          });
        }
      }

      // Update the priest profile approval status if it exists
      try {
        const { error: priestProfileError } = await supabase
          .from('priest_profiles')
          .update({
            approval_status: status
          })
          .eq('user_id', userId);

        if (priestProfileError && priestProfileError.code !== 'PGRST116') {
          console.error("Error updating priest profile approval status:", priestProfileError);
        } else {
          console.log("Priest profile approval status updated successfully");
        }
      } catch (profileUpdateError) {
        console.error("Error updating priest profile approval status:", profileUpdateError);
      }

      // Force immediate data refresh with aggressive invalidation strategy
      await invalidateAndRefreshData(userId);
      
      toast({
        title: "Success",
        description: `Priest application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
      
      setIsProcessing(false);
      return true;
    } catch (error: any) {
      console.error("Error in handlePriestApproval:", error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update priest status",
      });
      return false;
    }
  };

  // Enhanced data refresh with multiple strategies to ensure UI updates
  const invalidateAndRefreshData = async (userId?: string) => {
    console.log("Starting aggressive data refresh strategy...");
    
    try {
      // 1. First invalidate all related queries
      console.log("Invalidating all related queries...");
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] }); // Also invalidate individual profile queries
      await queryClient.invalidateQueries({ queryKey: ['priestProfile'] }); // Invalidate priest profile queries
      
      // 2. Immediate refetch
      console.log("Performing immediate refetch...");
      await refetchProfiles();
      
      // 3. Schedule multiple delayed refetches to ensure data consistency
      const delayedRefetches = [500, 1500, 3000].map(delay => 
        new Promise(resolve => {
          setTimeout(async () => {
            console.log(`Performing delayed refetch after ${delay}ms...`);
            try {
              await refetchProfiles();
              console.log(`Delayed refetch after ${delay}ms completed successfully`);
            } catch (e) {
              console.error(`Error in delayed refetch after ${delay}ms:`, e);
            }
            resolve(true);
          }, delay);
        })
      );
      
      // Let them run in parallel but don't wait for completion
      Promise.all(delayedRefetches).catch(e => 
        console.error("Error in delayed refetches:", e)
      );
      
      console.log("Initial data refresh completed");
      
      // 4. Direct verification of data update (only if userId is provided)
      if (userId) {
        setTimeout(async () => {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, priest_status, is_priest')
              .eq('id', userId)
              .single();
            
            console.log("Direct database verification result:", data);
          } catch (e) {
            console.error("Error in direct database verification:", e);
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error("Error during data refresh:", error);
      // Even if there's an error, try one more time
      setTimeout(() => refetchProfiles(), 2500);
    }
  };

  return {
    handlePriestApproval
  };
};
