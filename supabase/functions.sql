-- Function to check if service role is working
CREATE OR REPLACE FUNCTION public.check_service_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN TRUE;
END;
$$;

-- Function to update sender profile that can be called by the user
CREATE OR REPLACE FUNCTION public.update_sender_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_address TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.sender_profiles
  SET 
    full_name = p_full_name,
    email = p_email,
    address = p_address,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no rows were updated, insert a new profile
  IF NOT FOUND THEN
    INSERT INTO public.sender_profiles (user_id, full_name, email, address, created_at, updated_at)
    VALUES (p_user_id, p_full_name, p_email, p_address, NOW(), NOW());
  END IF;
END;
$$;

-- Admin function to update sender profile with service role
CREATE OR REPLACE FUNCTION public.admin_update_sender_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_address TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.sender_profiles
  SET 
    full_name = p_full_name,
    email = p_email,
    address = p_address,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no rows were updated, insert a new profile
  IF NOT FOUND THEN
    INSERT INTO public.sender_profiles (user_id, full_name, email, address, created_at, updated_at)
    VALUES (p_user_id, p_full_name, p_email, p_address, NOW(), NOW());
  END IF;
END;
$$;
