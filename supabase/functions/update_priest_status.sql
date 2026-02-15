
-- Function to update priest status
CREATE OR REPLACE FUNCTION public.update_priest_status(
  user_id uuid,
  new_status text,
  is_priest_value boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Update the profile with the new priest status
  UPDATE public.profiles
  SET 
    priest_status = new_status,
    is_priest = is_priest_value
  WHERE id = user_id;

  -- Return success result
  SELECT json_build_object(
    'success', true,
    'user_id', user_id,
    'status', new_status,
    'is_priest', is_priest_value
  ) INTO result;

  RETURN result;
END;
$$;
