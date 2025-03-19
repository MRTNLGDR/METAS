/*
  # Add User Management Features

  1. New Tables
    - `account_tiers`: Defines different subscription levels
    - `user_profiles`: Extended user information
    - `user_analytics`: User activity tracking
    - `user_sessions`: Session tracking
    - `audit_logs`: System-wide audit logging

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
*/

-- Create account_tiers table
CREATE TABLE IF NOT EXISTS account_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2),
  features jsonb DEFAULT '{}',
  limits jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  account_tier_id uuid REFERENCES account_tiers(id),
  display_name text,
  avatar_url text,
  bio text,
  company text,
  website text,
  location text,
  social_links jsonb DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration interval GENERATED ALWAYS AS (ended_at - started_at) STORED,
  ip_address text,
  user_agent text,
  device_info jsonb DEFAULT '{}',
  location_info jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}'
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE account_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for account_tiers
CREATE POLICY "Everyone can view account tiers"
  ON account_tiers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can manage account tiers"
  ON account_tiers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for user_analytics
CREATE POLICY "Users can view their own analytics"
  ON user_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics"
  ON user_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for user_sessions
CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for audit_logs
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);

-- Create triggers
CREATE TRIGGER update_account_tiers_updated_at
  BEFORE UPDATE ON account_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default account tiers
INSERT INTO account_tiers (name, description, price, features, limits)
VALUES
  (
    'Free',
    'Basic features for individual users',
    0,
    jsonb_build_object(
      'chat', true,
      'storage', true,
      'plugins', true
    ),
    jsonb_build_object(
      'storage_limit', 1073741824, -- 1GB in bytes
      'plugins_limit', 3,
      'collaborators', 0
    )
  ),
  (
    'Pro',
    'Advanced features for professionals',
    29.99,
    jsonb_build_object(
      'chat', true,
      'storage', true,
      'plugins', true,
      'advanced_ai', true,
      'priority_support', true
    ),
    jsonb_build_object(
      'storage_limit', 10737418240, -- 10GB in bytes
      'plugins_limit', 10,
      'collaborators', 5
    )
  ),
  (
    'Enterprise',
    'Full features for organizations',
    99.99,
    jsonb_build_object(
      'chat', true,
      'storage', true,
      'plugins', true,
      'advanced_ai', true,
      'priority_support', true,
      'custom_plugins', true,
      'audit_logs', true,
      'sso', true
    ),
    jsonb_build_object(
      'storage_limit', 107374182400, -- 100GB in bytes
      'plugins_limit', -1, -- unlimited
      'collaborators', -1 -- unlimited
    )
  );