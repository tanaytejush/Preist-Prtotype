
import { UserProfile } from '@/types/priest';

export interface DialogState {
  type: 'approve' | 'reject' | 'admin' | 'priest' | 'revoke-priest' | null;
  userId: string | null;
}

export interface UserTabProps {
  profiles: UserProfile[] | undefined;
  isLoading: boolean;
  isProcessing: boolean;
  refetchProfiles: () => Promise<any>;
  handlePriestApproval: (userId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  toggleAdminStatus: (userId: string, currentStatus: boolean) => Promise<boolean>;
  revokePriestStatus: (userId: string) => Promise<boolean>;
}

export interface ProcessingState {
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export interface ProfilesState {
  profiles: UserProfile[] | undefined;
  profilesLoading: boolean;
  refetchProfiles: () => Promise<any>;
}
