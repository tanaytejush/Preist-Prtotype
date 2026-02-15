
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface PriestAccessInstructionsProps {
  onDismiss: () => void;
}

const PriestAccessInstructions = ({ onDismiss }: PriestAccessInstructionsProps) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-800 dark:text-amber-400">Accessing the Priest Dashboard</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
        <p className="mb-4">To access the Priest Dashboard, follow these steps:</p>
        
        <ol className="list-decimal pl-5 space-y-2">
          <li>Sign in with your priest account credentials or Google authentication</li>
          <li>Navigate to the Priest Dashboard from the user dropdown in the top right</li>
          <li>Request admin approval if this is your first time accessing priestly functions</li>
          <li>Explore the schedule, rituals, teachings, and profile sections using the tabs below</li>
        </ol>
        
        <div className="mt-5 flex justify-end">
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
          >
            Got it
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PriestAccessInstructions;
