
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, BookOpen, Heart, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  email?: string;
  created_at?: string;
}

const AdminDashboardStats = () => {
  const [userTrend, setUserTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [growthData, setGrowthData] = useState<any[]>([]);
  
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Generate mock growth data based on real user count
  useEffect(() => {
    if (profiles) {
      // Sort profiles by creation date to analyze growth
      const sortedProfiles = [...profiles].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date();
        const dateB = b.created_at ? new Date(b.created_at) : new Date();
        return dateA.getTime() - dateB.getTime();
      });
      
      // Determine trend based on user growth
      if (sortedProfiles.length > 1) {
        const firstHalf = sortedProfiles.slice(0, Math.floor(sortedProfiles.length / 2)).length;
        const secondHalf = sortedProfiles.slice(Math.floor(sortedProfiles.length / 2)).length;
        
        if (secondHalf > firstHalf) {
          setUserTrend('up');
        } else if (secondHalf < firstHalf) {
          setUserTrend('down');
        } else {
          setUserTrend('stable');
        }
      }
      
      // Generate growth data for the chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      const chartData = months.map((month, index) => {
        // Calculate a value based on current user count with some random variation
        // This creates a somewhat realistic growth pattern
        const baseValue = profiles.length;
        const monthValue = index <= currentMonth 
          ? Math.max(0, Math.floor(baseValue * (index / 12) + Math.random() * 5))
          : 0;
          
        return {
          name: month,
          users: monthValue,
        };
      });
      
      setGrowthData(chartData);
    }
  }, [profiles]);

  const StatCard = ({ icon: Icon, title, value, trend, color, isLoading }: { 
    icon: any, 
    title: string, 
    value: string | number,
    trend?: 'up' | 'down' | 'stable',
    color: string,
    isLoading?: boolean
  }) => (
    <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50">
      <CardContent className="flex items-center p-6">
        <div className={`${color} p-3 rounded-lg mr-4`}>
          <Icon className="h-6 w-6 text-spiritual-brown dark:text-spiritual-cream" />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-spiritual-brown/70 dark:text-spiritual-cream/70">{title}</p>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-spiritual-brown dark:text-spiritual-cream" />
              <span className="text-spiritual-brown/50 dark:text-spiritual-cream/50">Loading...</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-spiritual-brown dark:text-spiritual-cream">{value}</p>
          )}
        </div>
        {trend && (
          <div className="ml-auto">
            {trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
            {trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
            {trend === 'stable' && <span className="inline-block h-1 w-5 bg-gray-400 rounded-full mt-2"></span>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={Users} 
          title="Total Users" 
          value={isLoading ? "" : profiles?.length || 0} 
          trend={userTrend}
          color="bg-spiritual-gold/20" 
          isLoading={isLoading}
        />
        
        <StatCard 
          icon={Calendar} 
          title="Upcoming Events" 
          value="12" 
          color="bg-spiritual-lotus/20"
        />
        
        <StatCard 
          icon={BookOpen} 
          title="Teachings" 
          value="76" 
          color="bg-spiritual-peacock/20"
        />
        
        <StatCard 
          icon={Heart} 
          title="Donations" 
          value="$15,245" 
          trend="up" 
          color="bg-spiritual-saffron/20"
        />
      </div>
      
      {/* Growth Chart */}
      <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-spiritual-brown dark:text-spiritual-cream mb-4">User Growth</h3>
          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-spiritual-gold" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={growthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d4" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--foreground)" 
                    tick={{ fill: 'var(--foreground)' }} 
                  />
                  <YAxis 
                    stroke="var(--foreground)" 
                    tick={{ fill: 'var(--foreground)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminDashboardStats;
