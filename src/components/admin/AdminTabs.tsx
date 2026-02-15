import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Mail, Calendar, BookOpen, Gift, BookMarked, UserCheck } from 'lucide-react';
import UsersTab from '@/components/admin/tabs/UsersTab';
import ContactTab from '@/components/admin/tabs/ContactTab';
import EventsTab from '@/components/admin/tabs/EventsTab';
import TeachingsTab from '@/components/admin/tabs/TeachingsTab';
import DonationsTab from '@/components/admin/tabs/DonationsTab';
import BookingsTab from '@/components/admin/tabs/BookingsTab';
import PriestBookingsTab from '@/components/admin/tabs/PriestBookingsTab';
import { useLocation } from 'react-router-dom';

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState('users');
  const location = useLocation();
  
  // Set active tab based on URL hash if present
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['users', 'contact', 'events', 'teachings', 'donations', 'bookings', 'priest-bookings'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash for better navigation
    window.history.replaceState(null, '', `#${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6 flex flex-wrap justify-start gap-1 bg-spiritual-cream/10 dark:bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        <TabsTrigger 
          value="users" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>
        <TabsTrigger 
          value="priest-bookings" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <UserCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Priest Bookings</span>
        </TabsTrigger>
        <TabsTrigger 
          value="contact" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Contact</span>
        </TabsTrigger>
        <TabsTrigger 
          value="events" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        <TabsTrigger 
          value="teachings" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Teachings</span>
        </TabsTrigger>
        <TabsTrigger 
          value="bookings" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <BookMarked className="h-4 w-4" />
          <span className="hidden sm:inline">Bookings</span>
        </TabsTrigger>
        <TabsTrigger 
          value="donations" 
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-spiritual-brown dark:data-[state=active]:text-spiritual-cream"
        >
          <Gift className="h-4 w-4" />
          <span className="hidden sm:inline">Donations</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="focus-visible:outline-none">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="priest-bookings" className="focus-visible:outline-none">
        <PriestBookingsTab />
      </TabsContent>
      
      <TabsContent value="contact" className="focus-visible:outline-none">
        <ContactTab />
      </TabsContent>
      
      <TabsContent value="events" className="focus-visible:outline-none">
        <EventsTab />
      </TabsContent>
      
      <TabsContent value="teachings" className="focus-visible:outline-none">
        <TeachingsTab />
      </TabsContent>
      
      <TabsContent value="bookings" className="focus-visible:outline-none">
        <BookingsTab />
      </TabsContent>
      
      <TabsContent value="donations" className="focus-visible:outline-none">
        <DonationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
