
-- Add the missing tracking columns to priest_bookings table
ALTER TABLE public.priest_bookings 
ADD COLUMN IF NOT EXISTS estimated_arrival TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS priest_started_journey BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS priest_current_location JSONB;

-- Ensure the priest_locations table exists (it should from the previous migration)
-- This is a safety check in case it wasn't created properly
CREATE TABLE IF NOT EXISTS public.priest_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  priest_id UUID NOT NULL REFERENCES priest_profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES priest_bookings(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2),
  speed DECIMAL(5, 2),
  accuracy DECIMAL(5, 2),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_priest_locations_priest_id ON priest_locations(priest_id);
CREATE INDEX IF NOT EXISTS idx_priest_locations_booking_id ON priest_locations(booking_id);
CREATE INDEX IF NOT EXISTS idx_priest_locations_updated_at ON priest_locations(updated_at DESC);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.priest_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'priest_locations' 
        AND policyname = 'Users can view location for their bookings'
    ) THEN
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
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'priest_locations' 
        AND policyname = 'Priests can insert their own location'
    ) THEN
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
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'priest_locations' 
        AND policyname = 'Priests can view their own location data'
    ) THEN
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
    END IF;
END
$$;

-- Enable realtime for live tracking
ALTER TABLE public.priest_locations REPLICA IDENTITY FULL;
ALTER TABLE public.priest_bookings REPLICA IDENTITY FULL;

-- Add to realtime publication if not already added
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'priest_locations') THEN
        PERFORM supabase_realtime.publication_add('priest_locations');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'priest_bookings') THEN
        PERFORM supabase_realtime.publication_add('priest_bookings');
    END IF;
END
$$;
