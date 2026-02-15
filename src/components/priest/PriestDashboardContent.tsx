
import React, { useState } from 'react';
import { usePriestDashboard } from '@/contexts/PriestDashboardContext';
import PriestDashboardHeader from './PriestDashboardHeader';
import PriestDashboardCards from './PriestDashboardCards';
import PriestTabNavigation from './PriestTabNavigation';
import PriestProfile from './PriestProfile';
import PriestSchedule from './PriestSchedule';
import PriestRituals from './PriestRituals';
import PriestTeachings from './PriestTeachings';

export type PriestTab = 'overview' | 'profile' | 'schedule' | 'rituals' | 'teachings';

const PriestDashboardContent = () => {
  const { priestBookings, priestProfile } = usePriestDashboard();
  const [activeTab, setActiveTab] = useState<PriestTab>('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as PriestTab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PriestProfile />;
      case 'schedule':
        return <PriestSchedule />;
      case 'rituals':
        return <PriestRituals />;
      case 'teachings':
        return <PriestTeachings />;
      default:
        return (
          <PriestDashboardCards 
            setActiveTab={handleTabChange}
            bookings={priestBookings || []}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <PriestDashboardHeader />
      
      <PriestTabNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default PriestDashboardContent;
