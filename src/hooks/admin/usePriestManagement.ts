
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProcessingState, ProfilesState } from './types';
import { usePriestStatus } from './usePriestStatus';
import { usePriestRevocation } from './usePriestRevocation';

export const usePriestManagement = (
  processingState: ProcessingState,
  profilesState: ProfilesState
) => {
  const queryClient = useQueryClient();
  
  // Priest status management (approve/reject)
  const { handlePriestApproval } = usePriestStatus(processingState, profilesState);
  
  // Priest revocation
  const { revokePriestStatus } = usePriestRevocation(processingState, profilesState);

  // Enhanced invalidation function with better logging and forced refetch
  const invalidatePriestQueries = async () => {
    console.log("Starting complete data invalidation process...");
    
    try {
      // First invalidate all queries
      console.log("Invalidating cached queries...");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['profiles'] }),
        queryClient.invalidateQueries({ queryKey: ['priest-status'] }),
        queryClient.invalidateQueries({ queryKey: ['priest-profile'] }),
        queryClient.invalidateQueries({ queryKey: ['priest-bookings'] })
      ]);
      
      console.log("All queries invalidated successfully");
      
      // Force immediate refetch
      console.log("Forcing immediate profiles refetch");
      await profilesState.refetchProfiles();
      
      // Add multiple refetches after short delays for extra reliability
      const delays = [800, 2000, 4000];
      for (const delay of delays) {
        setTimeout(async () => {
          console.log(`Performing follow-up profiles refetch after ${delay}ms`);
          try {
            await profilesState.refetchProfiles();
            console.log(`Follow-up refetch after ${delay}ms completed`);
          } catch (e) {
            console.error(`Error during follow-up refetch after ${delay}ms:`, e);
          }
        }, delay);
      }
      
    } catch (error) {
      console.error("Error during data refresh:", error);
      // Try one more time as a fallback
      setTimeout(async () => {
        try {
          await profilesState.refetchProfiles();
          console.log("Fallback refetch succeeded");
        } catch (e) {
          console.error("Even fallback refetch failed:", e);
        }
      }, 2000);
    }
  };

  // Improved approval handler with better logging and refresh mechanism
  const handlePriestApprovalWithRefresh = async (userId: string, status: 'approved' | 'rejected') => {
    console.log(`Starting enhanced priest ${status} process for user ${userId}`);
    const success = await handlePriestApproval(userId, status);
    
    if (success) {
      console.log(`${status} successful, starting comprehensive data refresh`);
      await invalidatePriestQueries();
      
      // Add a delay and check if the profile actually updated
      setTimeout(async () => {
        const { data } = await supabase
          .from('profiles')
          .select('priest_status, is_priest, first_name, last_name')
          .eq('id', userId)
          .single();
          
        console.log("Profile state after update:", data);
        
        // If data doesn't match expected state, try refreshing again
        if (data && ((status === 'approved' && !data.is_priest) || 
                     (status === 'rejected' && data.priest_status !== 'rejected'))) {
          console.log("Data inconsistency detected, refreshing again");
          await profilesState.refetchProfiles();
        }
      }, 2000);
    } else {
      console.log("Approval failed, not refreshing data");
    }
    
    return success;
  };

  // Improved revocation handler
  const revokePriestStatusWithRefresh = async (userId: string) => {
    console.log(`Starting enhanced priest revocation process for user ${userId}`);
    const success = await revokePriestStatus(userId);
    
    if (success) {
      console.log("Revocation successful, starting comprehensive data refresh");
      await invalidatePriestQueries();
    }
    
    return success;
  };

  return {
    handlePriestApproval: handlePriestApprovalWithRefresh,
    revokePriestStatus: revokePriestStatusWithRefresh
  };
};
