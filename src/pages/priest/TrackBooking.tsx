
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PriestTrackingCard from '@/components/tracking/PriestTrackingCard';
import { PriestBooking } from '@/types/priest';

const TrackBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-tracking', id],
    queryFn: async () => {
      if (!id) throw new Error("Booking ID is required");
      
      const { data, error } = await supabase
        .from('priest_bookings')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          ),
          priest_profiles:priest_id (
            name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Check if user has access to this booking
  useEffect(() => {
    if (booking && user && booking.user_id !== user.id) {
      navigate('/profile');
      return;
    }
  }, [booking, user, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-spiritual-gold" />
            <p className="mt-4 text-lg text-spiritual-brown">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
          <div className="text-center max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Not Found</h2>
            <p className="text-gray-700 mb-6">
              We couldn't find the booking you're looking for, or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/profile')} className="bg-spiritual-gold hover:bg-spiritual-gold/90">
              Go to Profile
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline" 
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-spiritual-brown">Track Your Booking</h1>
              <p className="text-gray-600">Real-time updates for your priest booking</p>
            </div>
          </div>

          {/* Tracking Card */}
          <PriestTrackingCard 
            booking={booking as any}
            priestInfo={booking.priest_profiles || undefined}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackBooking;
