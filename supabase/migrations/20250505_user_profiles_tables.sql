-- Create sender_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS sender_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'pending',
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carrier_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS carrier_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  vehicle_type TEXT,
  vehicle_registration TEXT,
  license_number TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')) DEFAULT 'pending',
  kyc_verified BOOLEAN DEFAULT FALSE,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sender_profiles_user_id ON sender_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_carrier_profiles_user_id ON carrier_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sender_profiles_status ON sender_profiles(status);
CREATE INDEX IF NOT EXISTS idx_carrier_profiles_status ON carrier_profiles(status);
