
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PriestLayout from '@/components/priest/PriestLayout';
import PriestDashboardContent from '@/components/priest/PriestDashboardContent';
import PriestDashboardLoading from '@/components/priest/PriestDashboardLoading';
import PriestAccessRestricted from '@/components/priest/PriestAccessRestricted';
import { PriestDashboardProvider, usePriestDashboard } from '@/contexts/PriestDashboardContext';

const PriestDashboardRenderer = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const { priestStatus, priestStatusLoading, priestProfileLoading, priestProfile, bookingsLoading } = usePriestDashboard();
  
  if (isLoading || priestStatusLoading) {
    return <PriestDashboardLoading fullScreen />;
  }
  
  // Allow admins to access, otherwise check if user is a priest with approved status
  if (!user) {
    return <PriestAccessRestricted reason="not-signed-in" />;
  }
  
  if (!isAdmin) {
    if (!priestStatus?.is_priest) {
      return <PriestAccessRestricted reason="not-priest" />;
    }
    
    if (priestStatus?.priest_status === 'pending') {
      return <PriestAccessRestricted reason="pending" />;
    }
    
    if (priestStatus?.priest_status === 'rejected') {
      return <PriestAccessRestricted reason="rejected" />;
    }
  }
  
  if (priestProfileLoading || bookingsLoading) {
    return <PriestDashboardLoading message="Loading your priest data..." />;
  }
  
  return (
    <PriestLayout>
      <PriestDashboardContent />
    </PriestLayout>
  );
};

const PriestDashboard = () => {
  return (
    <PriestDashboardProvider>
      <PriestDashboardRenderer />
    </PriestDashboardProvider>
  );
};

export default PriestDashboard;
