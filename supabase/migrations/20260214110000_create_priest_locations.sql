
-- Create a table to store priest locations and tracking data
CREATE TABLE public.priest_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  priest_id UUID NOT NULL REFERENCES priest_profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES priest_bookings(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2), -- Direction in degrees (0-360)
  speed DECIMAL(5, 2), -- Speed in km/h
  accuracy DECIMAL(5, 2), -- GPS accuracy in meters
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add estimated arrival time to bookings
ALTER TABLE public.priest_bookings 
ADD COLUMN estimated_arrival TIMESTAMP WITH TIME ZONE,
ADD COLUMN priest_started_journey BOOLEAN DEFAULT FALSE,
ADD COLUMN priest_current_location JSONB;

-- Create indexes for better performance
CREATE INDEX idx_priest_locations_priest_id ON priest_locations(priest_id);
CREATE INDEX idx_priest_locations_booking_id ON priest_locations(booking_id);
CREATE INDEX idx_priest_locations_updated_at ON priest_locations(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.priest_locations ENABLE ROW LEVEL SECURITY;

-- RLS policies for priest locations
CREATE POLICY "Users can view location for their bookings" 
  ON public.priest_locations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM priest_bookings 
      WHERE priest_bookings.id = priest_locations.booking_id 
      AND priest_bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Priests can insert their own location" 
  ON public.priest_locations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM priest_profiles 
      WHERE priest_profiles.id = priest_locations.priest_id 
      AND priest_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Priests can view their own location data" 
  ON public.priest_locations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM priest_profiles 
      WHERE priest_profiles.id = priest_locations.priest_id 
      AND priest_profiles.user_id = auth.uid()
    )
  );

-- Enable realtime for live tracking
ALTER TABLE public.priest_locations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.priest_locations;

-- Also enable realtime for booking updates
ALTER TABLE public.priest_bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.priest_bookings;
