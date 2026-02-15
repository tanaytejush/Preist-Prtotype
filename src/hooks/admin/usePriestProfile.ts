
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePriestProfile = () => {
  const { toast } = useToast();

  const createPriestProfile = async (userId: string) => {
    try {
      console.log("Creating priest profile for user ID:", userId);

      // First, check if priest profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('priest_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing priest profile:", checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log("Priest profile already exists for user:", userId);
        // Update existing profile to approved status
        const { error: updateError } = await supabase
          .from('priest_profiles')
          .update({
            approval_status: 'approved'
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Error updating existing priest profile:", updateError);
          throw updateError;
        }

        console.log("Updated existing priest profile approval status to approved");
        return existingProfile;
      }

      // Get user profile information
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error("Error fetching user profile:", userError);
        throw userError;
      }

      // Create new priest profile with approved status
      const priestProfileData = {
        user_id: userId,
        name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New Priest',
        description: 'Experienced priest offering spiritual services',
        specialties: ['General Ceremonies'],
        experience_years: 1,
        avatar_url: userProfile.avatar_url || '/placeholder.svg',
        base_price: 100,
        availability: 'Available for booking',
        location: 'Temple',
        approval_status: 'approved' as const
      };

      console.log("Creating priest profile with data:", priestProfileData);

      const { data: newProfile, error: createError } = await supabase
        .from('priest_profiles')
        .insert(priestProfileData)
        .select()
        .single();

      if (createError) {
        console.error("Error creating priest profile:", createError);
        throw createError;
      }

      console.log("Priest profile created successfully:", newProfile);
      return newProfile;

    } catch (error: any) {
      console.error("Error in createPriestProfile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create priest profile",
      });
      throw error;
    }
  };

  return {
    createPriestProfile
  };
};
