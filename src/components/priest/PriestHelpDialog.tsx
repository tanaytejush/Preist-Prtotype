
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePriestDashboard } from '@/contexts/PriestDashboardContext';

const PriestHelpDialog = () => {
  const { showHelpDialog, setShowHelpDialog } = usePriestDashboard();

  return (
    <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Priest Dashboard Help</DialogTitle>
          <DialogDescription>
            Here's how to use the priest dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-spiritual-brown dark:text-spiritual-cream">How to access the Priest Dashboard:</h3>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Sign in to your account</li>
              <li>Submit a priest application from your profile page</li>
              <li>Wait for an admin to approve your application</li>
              <li>Once approved, visit /priest or click "Priest Dashboard" from your profile</li>
              <li>Admins can access this dashboard directly without needing priest status</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-medium text-spiritual-brown dark:text-spiritual-cream">Managing Your Schedule:</h3>
            <p>Use the Schedule tab to view and manage booking requests from devotees.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-spiritual-brown dark:text-spiritual-cream">Managing Rituals:</h3>
            <p>Use the Rituals tab to add, edit, and manage the ceremonies you can perform.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-spiritual-brown dark:text-spiritual-cream">Teaching Content:</h3>
            <p>Use the Teachings tab to create and publish spiritual content for devotees.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriestHelpDialog;
