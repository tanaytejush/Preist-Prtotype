
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import UsersTable from '../users/UsersTable';
import UserDialogs from '../users/UserDialogs';
import { DialogState, UserTabProps } from '../types';

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'priests' | 'pending'>('all');
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, userId: null });
  
  const {
    profiles,
    profilesLoading,
    isProcessing,
    toggleAdminStatus,
    handlePriestApproval,
    revokePriestStatus,
    handleRefresh,
    refetchProfiles
  } = useUserManagement();

  // Calculate counts for UI badges
  const pendingCount = profiles?.filter(p => p.priest_status === 'pending').length || 0;
  const priestsCount = profiles?.filter(p => p.is_priest === true).length || 0;

  // Callback for successful priest approval
  const onPriestApproved = useCallback((userId: string) => {
    console.log("Priest approved callback triggered for user:", userId);
    // Switch to priests tab
    setActiveTab('priests');
    // Force a data refresh
    setTimeout(() => {
      console.log("Forcing refresh after priest approval");
      refetchProfiles();
      console.log("Data refreshed after priest approval");
    }, 1000);
  }, [refetchProfiles]);

  // Auto-refresh when dialog closes or processing finishes
  useEffect(() => {
    if (dialogState.type === null && !isProcessing) {
      console.log("Dialog closed or processing finished, refreshing data");
      refetchProfiles();
    }
  }, [dialogState.type, isProcessing, refetchProfiles]);

  // Auto-refresh on tab change to ensure data freshness
  useEffect(() => {
    console.log("Tab changed to:", activeTab);
    refetchProfiles();
  }, [activeTab, refetchProfiles]);

  // Auto-switch to priests tab when a priest is approved and there are no more pending requests
  useEffect(() => {
    if (pendingCount === 0 && activeTab === 'pending' && priestsCount > 0) {
      console.log("No more pending requests, switching to priests tab");
      setActiveTab('priests');
    }
  }, [pendingCount, priestsCount, activeTab]);

  // Force refresh on component mount
  useEffect(() => {
    console.log("UsersTab mounted, forcing initial data refresh");
    refetchProfiles();
  }, [refetchProfiles]);

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-spiritual-cream/30 dark:bg-gray-800/50 rounded-t-lg border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-spiritual-brown dark:text-spiritual-cream font-sanskrit">User Management</CardTitle>
            <CardDescription className="text-spiritual-brown/70 dark:text-spiritual-cream/70">
              View and manage your platform users
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-auto min-w-[200px] bg-white dark:bg-gray-800"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                console.log("Manual refresh triggered");
                handleRefresh();
              }}
              disabled={isProcessing || profilesLoading}
              className="text-spiritual-brown dark:text-spiritual-cream"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(isProcessing || profilesLoading) ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Processing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-700">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'priests' | 'pending')}>
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="priests" className="relative">
              Priests
              {priestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {priestsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-0">
        {profilesLoading || isProcessing ? (
          <div className="py-10 text-center">
            <div className="inline-block rangoli-spinner"></div>
            <p className="mt-2 text-spiritual-brown/70 dark:text-spiritual-cream/70">
              {isProcessing ? 'Processing request...' : 'Loading users...'}
            </p>
          </div>
        ) : (
          <UsersTable 
            profiles={profiles}
            isProcessing={isProcessing}
            searchTerm={searchTerm}
            activeTab={activeTab}
            setDialogState={setDialogState}
          />
        )}
      </CardContent>
      
      <UserDialogs 
        dialogState={dialogState}
        setDialogState={setDialogState}
        profiles={profiles}
        isProcessing={isProcessing}
        toggleAdminStatus={toggleAdminStatus}
        handlePriestApproval={async (userId, status) => {
          console.log(`Handling priest approval for ${userId} with status ${status}`);
          const success = await handlePriestApproval(userId, status);
          if (success && status === 'approved') {
            setTimeout(() => onPriestApproved(userId), 1500);
          }
          return success;
        }}
        revokePriestStatus={revokePriestStatus}
      />
    </Card>
  );
};

export default UsersTab;
