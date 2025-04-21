-- Enable RLS on the sender_profiles table
ALTER TABLE public.sender_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own profile
CREATE POLICY "Users can view their own profile"
  ON public.sender_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.sender_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.sender_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
