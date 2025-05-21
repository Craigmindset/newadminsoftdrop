-- Create sender_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS sender_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  default_address TEXT,
  preferred_payment_method TEXT,
  profile_image TEXT,
  status TEXT DEFAULT 'pending',
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
  vehicle_type TEXT,
  license_number TEXT,
  kyc_status TEXT DEFAULT 'pending',
  profile_image TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id),
  carrier_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sender_profiles_user_id ON sender_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_carrier_profiles_user_id ON carrier_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_id ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_carrier_id ON transactions(carrier_id);
