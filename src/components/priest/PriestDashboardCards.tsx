
import React from 'react';
import { Calendar, Users, DollarSign, BookOpen } from 'lucide-react';
import { PriestBooking } from '@/types/priest';
import { usePriestDashboard } from '@/contexts/PriestDashboardContext';
import StatsCard from './cards/StatsCard';
import ScheduleCard from './cards/schedule/ScheduleCard';
import RecentBookingsCard from './cards/RecentBookingsCard';

interface PriestDashboardCardsProps {
  setActiveTab: (tab: string) => void;
  bookings: PriestBooking[];
}

const PriestDashboardCards: React.FC<PriestDashboardCardsProps> = ({ setActiveTab, bookings }) => {
  const { priestProfile } = usePriestDashboard();

  // Get today's bookings
  const today = new Date();
  const todaysBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    return bookingDate.toDateString() === today.toDateString();
  });

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats Cards */}
      <StatsCard
        title="Total Bookings"
        value={totalBookings.toString()}
        icon={Calendar}
        color="blue"
        onClick={() => setActiveTab('schedule')}
      />
      
      <StatsCard
        title="Pending Requests"
        value={pendingBookings.toString()}
        icon={Users}
        color="amber"
        onClick={() => setActiveTab('schedule')}
      />
      
      <StatsCard
        title="Completed"
        value={completedBookings.toString()}
        icon={BookOpen}
        color="green"
        onClick={() => setActiveTab('schedule')}
      />
      
      <StatsCard
        title="Total Revenue"
        value={`₹${totalRevenue}`}
        icon={DollarSign}
        color="purple"
      />

      {/* Schedule Card - Full Width */}
      <div className="md:col-span-2 lg:col-span-2">
        <ScheduleCard 
          todaysBookings={todaysBookings} 
          onViewFullSchedule={() => setActiveTab('schedule')}
          priestId={priestProfile?.id}
        />
      </div>

      {/* Recent Bookings Card */}
      <div className="md:col-span-2 lg:col-span-2">
        <RecentBookingsCard 
          bookings={bookings.slice(0, 5)} 
          onViewAll={() => setActiveTab('schedule')}
        />
      </div>
    </div>
  );
};

export default PriestDashboardCards;
