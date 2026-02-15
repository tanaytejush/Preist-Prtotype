
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { usePriestDashboard } from '@/contexts/PriestDashboardContext';
import { useAuth } from '@/contexts/AuthContext';

const PriestDashboardHeader = () => {
  const { refreshPriestData, setShowHelpDialog } = usePriestDashboard();
  const { isAdmin } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-spiritual-brown dark:text-spiritual-cream">
        {isAdmin ? "Admin View: Priest Dashboard" : "Priest Dashboard"}
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPriestData}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelpDialog(true)}
          className="flex items-center gap-1"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </Button>
      </div>
    </div>
  );
};

export default PriestDashboardHeader;
