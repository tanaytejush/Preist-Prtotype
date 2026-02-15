
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfiles } from './useProfiles';
import { useAdminManagement } from './useAdminManagement';
import { usePriestManagement } from './usePriestManagement';

export const useUserManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  const processingState = { isProcessing, setIsProcessing };
  
  // Get profiles
  const { 
    profiles, 
    profilesLoading, 
    refetchProfiles,
    handleRefresh
  } = useProfiles(processingState);

  const profilesState = { profiles, profilesLoading, refetchProfiles };

  // Admin management
  const { toggleAdminStatus } = useAdminManagement(processingState, profilesState);
  
  // Priest management
  const { handlePriestApproval, revokePriestStatus } = usePriestManagement(processingState, profilesState);

  return {
    // Profiles data
    profiles,
    profilesLoading,
    refetchProfiles,
    
    // Processing state
    isProcessing,
    setIsProcessing,
    
    // Admin functions
    toggleAdminStatus,
    
    // Priest functions
    handlePriestApproval,
    revokePriestStatus,
    
    // Utility functions
    handleRefresh
  };
};
