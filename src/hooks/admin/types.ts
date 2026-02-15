
import { UserProfile } from '@/types/priest';

export interface ProcessingState {
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export interface ProfilesState {
  profiles: UserProfile[] | undefined;
  profilesLoading: boolean;
  refetchProfiles: () => Promise<any>;
}
