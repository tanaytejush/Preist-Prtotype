
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProcessingState, ProfilesState } from './types';

export const useAdminManagement = (
  processingState: ProcessingState,
  profilesState: ProfilesState
) => {
  const { toast } = useToast();
  const { setIsProcessing } = processingState;
  const { refetchProfiles } = profilesState;

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`,
      });
      
      await refetchProfiles();
      setIsProcessing(false);
      return true;
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update admin status",
      });
      return false;
    }
  };

  return {
    toggleAdminStatus
  };
};
