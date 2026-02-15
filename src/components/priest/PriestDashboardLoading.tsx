
import React from 'react';
import { Loader2 } from 'lucide-react';
import PriestLayout from './PriestLayout';

interface PriestDashboardLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const PriestDashboardLoading: React.FC<PriestDashboardLoadingProps> = ({ 
  message = 'Loading Priest Dashboard...', 
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-spiritual-cream/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="p-8 rounded-xl bg-white/60 dark:bg-gray-800/30 backdrop-blur-md shadow-lg flex flex-col items-center border border-white/40 dark:border-gray-700/30">
          <div className="text-spiritual-gold">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
          </div>
          <p className="text-spiritual-brown dark:text-gray-200 font-sanskrit text-xl">{message}</p>
          <p className="text-spiritual-brown/70 dark:text-gray-400 text-sm mt-2">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <PriestLayout>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="p-8 flex flex-col items-center">
          <div className="text-spiritual-gold">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
          </div>
          <p className="text-spiritual-brown dark:text-spiritual-cream">{message}</p>
        </div>
      </div>
    </PriestLayout>
  );
};

export default PriestDashboardLoading;
