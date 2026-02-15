
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, BookOpen, Settings } from 'lucide-react';
import PriestProfile from './PriestProfile';
import PriestSchedule from './PriestSchedule';
import PriestTeachings from './PriestTeachings';
import PriestRituals from './PriestRituals';

type PriestTab = 'overview' | 'profile' | 'schedule' | 'teachings' | 'rituals';

interface PriestTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PriestTabNavigation: React.FC<PriestTabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-4 flex justify-center space-x-4">
        <TabsTrigger value="overview" className="data-[state=active]:bg-spiritual-gold/20 data-[state=active]:text-spiritual-brown flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-spiritual-gold/20 data-[state=active]:text-spiritual-brown flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </TabsTrigger>
        <TabsTrigger value="schedule" className="data-[state=active]:bg-spiritual-gold/20 data-[state=active]:text-spiritual-brown flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Schedule</span>
        </TabsTrigger>
        <TabsTrigger value="teachings" className="data-[state=active]:bg-spiritual-gold/20 data-[state=active]:text-spiritual-brown flex items-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span>Teachings</span>
        </TabsTrigger>
        <TabsTrigger value="rituals" className="data-[state=active]:bg-spiritual-gold/20 data-[state=active]:text-spiritual-brown flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Rituals</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default PriestTabNavigation;
