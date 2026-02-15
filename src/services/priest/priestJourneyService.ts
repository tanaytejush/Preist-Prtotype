
import { supabase } from '@/integrations/supabase/client';

export class PriestJourneyService {
  static async startJourney(bookingId: string, estimatedArrival?: Date): Promise<void> {
    try {
      const updates: any = {
        priest_started_journey: true
      };

      if (estimatedArrival) {
        updates.estimated_arrival = estimatedArrival.toISOString();
      }

      const { error } = await supabase
        .from('priest_bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error starting journey:', error);
      throw new Error(error.message || 'Failed to start journey');
    }
  }
}
