
import { supabase } from '@/integrations/supabase/client';
import { TrackingData, PriestLocation } from '@/types/tracking';

export class PriestTrackingDataService {
  static async fetchTrackingData(bookingId: string): Promise<{
    trackingData: TrackingData | null;
    priestLocation: PriestLocation | null;
  }> {
    if (!bookingId) {
      return { trackingData: null, priestLocation: null };
    }

    try {
      // Fetch booking data with priest info
      const { data: booking, error: bookingError } = await supabase
        .from('priest_bookings')
        .select(`
          *,
          priest_profiles:priest_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Try to fetch latest location - this might fail if table doesn't exist in types
      let location = null;
      try {
        const { data: locationData, error: locationError } = await supabase
          .from('priest_locations' as any)
          .select('*')
          .eq('booking_id', bookingId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!locationError) {
          location = locationData;
        }
      } catch (err) {
        console.log('priest_locations table not accessible through types yet');
      }

      const trackingData: TrackingData = {
        booking_id: booking.id,
        priest_id: booking.priest_id,
        current_location: (booking as any).priest_current_location || undefined,
        estimated_arrival: (booking as any).estimated_arrival || undefined,
        priest_started_journey: (booking as any).priest_started_journey || false,
        status: booking.status
      };

      return { trackingData, priestLocation: location };
    } catch (error: any) {
      console.error('Error fetching tracking data:', error);
      throw new Error(error.message || 'Failed to load tracking data');
    }
  }
}
