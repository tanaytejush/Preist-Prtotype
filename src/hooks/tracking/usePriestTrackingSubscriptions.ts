
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrackingData, PriestLocation } from '@/types/tracking';

interface UseTrackingSubscriptionsProps {
  bookingId?: string;
  onTrackingDataUpdate: (data: Partial<TrackingData>) => void;
  onLocationUpdate: (location: PriestLocation) => void;
}

export const usePriestTrackingSubscriptions = ({
  bookingId,
  onTrackingDataUpdate,
  onLocationUpdate
}: UseTrackingSubscriptionsProps) => {
  useEffect(() => {
    if (!bookingId) return;

    // Subscribe to booking updates
    const bookingChannel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'priest_bookings',
          filter: `id=eq.${bookingId}`
        },
        (payload) => {
          console.log('Booking updated:', payload);
          onTrackingDataUpdate({
            estimated_arrival: payload.new.estimated_arrival,
            priest_started_journey: payload.new.priest_started_journey,
            status: payload.new.status,
            current_location: payload.new.priest_current_location
          });
        }
      )
      .subscribe();

    // Subscribe to location updates - this might not work until types are updated
    const locationChannel = supabase
      .channel('location-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'priest_locations',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          console.log('Location updated:', payload);
          if (payload.new) {
            onLocationUpdate(payload.new as PriestLocation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(locationChannel);
    };
  }, [bookingId, onTrackingDataUpdate, onLocationUpdate]);
};
