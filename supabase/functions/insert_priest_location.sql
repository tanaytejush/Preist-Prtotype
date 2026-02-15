
CREATE OR REPLACE FUNCTION public.insert_priest_location(
  p_priest_id UUID,
  p_booking_id UUID,
  p_latitude DECIMAL(10, 8),
  p_longitude DECIMAL(11, 8),
  p_heading DECIMAL(5, 2) DEFAULT NULL,
  p_speed DECIMAL(5, 2) DEFAULT NULL,
  p_accuracy DECIMAL(5, 2) DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.priest_locations (
    priest_id, 
    booking_id, 
    latitude, 
    longitude, 
    heading, 
    speed, 
    accuracy
  )
  VALUES (
    p_priest_id, 
    p_booking_id, 
    p_latitude, 
    p_longitude, 
    p_heading, 
    p_speed, 
    p_accuracy
  );
END;
$$;
