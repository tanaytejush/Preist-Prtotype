
export interface PriestLocation {
  id: string;
  priest_id: string;
  booking_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  updated_at: string;
  created_at: string;
}

export interface TrackingData {
  booking_id: string;
  priest_id: string;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  estimated_arrival?: string;
  priest_started_journey: boolean;
  status: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}
