
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProcessingState, ProfilesState } from './types';

export const usePriestRevocation = (
  processingState: ProcessingState,
  profilesState: ProfilesState
) => {
  const { toast } = useToast();
  const { setIsProcessing } = processingState;
  const { refetchProfiles } = profilesState;

  const revokePriestStatus = async (userId: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ priest_status: null, is_priest: false })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Priest status revoked successfully",
      });
      
      await refetchProfiles();
      setIsProcessing(false);
      return true;
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to revoke priest status",
      });
      return false;
    }
  };

  return {
    revokePriestStatus
  };
};
