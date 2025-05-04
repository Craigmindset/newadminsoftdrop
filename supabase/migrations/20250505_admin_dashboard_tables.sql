-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  role TEXT CHECK (role IN ('sender', 'carrier', 'admin')),
  status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  carrier_id UUID REFERENCES profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in-transit', 'completed', 'cancelled')),
  type TEXT CHECK (type IN ('intracity', 'interstate', 'express')),
  payment_method TEXT CHECK (payment_method IN ('wallet', 'card', 'cash')),
  item_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create disputes table if it doesn't exist
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  sender_id UUID REFERENCES profiles(id),
  carrier_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'in-review', 'resolved')),
  resolution TEXT CHECK (resolution IN ('refunded', 'denied', 'partial_refund', NULL)),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  type TEXT CHECK (type IN ('delivery-issue', 'damaged-item', 'wrong-item', 'payment-issue', 'other')),
  reason TEXT,
  description TEXT,
  has_evidence BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_type ON disputes(type);
