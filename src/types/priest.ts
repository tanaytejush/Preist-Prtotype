
export interface PriestProfile {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  specialties: string[];
  experience_years: number;
  avatar_url: string;
  base_price: number;
  availability: string;
  location: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface PriestBooking {
  id?: string;
  user_id: string;
  priest_id: string;
  booking_date: string;
  purpose: string;
  address: string;
  notes?: string;
  price: number;
  status: string;
  estimated_arrival?: string;
  priest_started_journey?: boolean;
  priest_current_location?: any;
  created_at?: string;
  updated_at?: string;
  profiles?: any;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  avatar_url?: string | null;
  email?: string;
  is_priest: boolean;
  priest_status: 'pending' | 'approved' | 'rejected' | null;
  created_at?: string;
  updated_at?: string;
}
