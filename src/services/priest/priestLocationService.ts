
import { supabase } from '@/integrations/supabase/client';
import { LocationUpdate } from '@/types/tracking';

export class PriestLocationService {
  static async updateLocation(
    priestId: string,
    bookingId: string,
    locationUpdate: LocationUpdate
  ): Promise<void> {
    try {
      // Use raw SQL to insert into priest_locations table since it's not in types yet
      const { error } = await (supabase as any).rpc('insert_priest_location', {
        p_priest_id: priestId,
        p_booking_id: bookingId,
        p_latitude: locationUpdate.latitude,
        p_longitude: locationUpdate.longitude,
        p_heading: locationUpdate.heading || null,
        p_speed: locationUpdate.speed || null,
        p_accuracy: locationUpdate.accuracy || null
      });

      if (error) {
        console.error('Error updating priest location:', error);
        // Fallback: try direct table access
        const { error: directError } = await supabase
          .from('priest_locations' as any)
          .insert({
            priest_id: priestId,
            booking_id: bookingId,
            latitude: locationUpdate.latitude,
            longitude: locationUpdate.longitude,
            heading: locationUpdate.heading,
            speed: locationUpdate.speed,
            accuracy: locationUpdate.accuracy
          });

        if (directError) throw directError;
      }

      console.log('Priest location updated successfully');
    } catch (error: any) {
      console.error('Error updating priest location:', error);
      throw new Error('Failed to update priest location');
    }
  }
}
