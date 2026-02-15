
import { PriestBooking } from '@/types/priest';

/**
 * Filter bookings to get only today's bookings
 * 
 * @param bookings All priest bookings
 * @param limit Maximum number of bookings to return
 * @returns Today's bookings, up to the specified limit
 */
export const getTodaysBookings = (bookings: PriestBooking[], limit: number = 2): PriestBooking[] => {
  const today = new Date().toISOString().split('T')[0];
  return bookings
    .filter(booking => booking.booking_date.startsWith(today))
    .slice(0, limit);
};
