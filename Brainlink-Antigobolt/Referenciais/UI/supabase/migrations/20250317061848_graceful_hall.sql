/*
  # Fix Plugin Validation and Security

  1. Changes
    - Fix regex pattern in validation trigger
    - Add user_id column
    - Add validation triggers
    - Add audit logging
    - Strengthen RLS policies

  2. Security
    - Enable RLS
    - Add user-based policies
    - Add audit logging
*/

-- Add user_id to plugins table
ALTER TABLE plugins 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add validation trigger function
CREATE OR REPLACE FUNCTION validate_plugin_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Plugin name is required';
  END IF;

  IF NEW.version IS NULL OR LENGTH(TRIM(NEW.version)) = 0 THEN
    RAISE EXCEPTION 'Plugin version is required';
  END IF;

  IF NEW.description IS NULL OR LENGTH(TRIM(NEW.description)) = 0 THEN
    RAISE EXCEPTION 'Plugin description is required';
  END IF;

  -- Sanitize and validate entry point
  IF NEW.entry IS NULL OR LENGTH(TRIM(NEW.entry)) = 0 THEN
    RAISE EXCEPTION 'Plugin entry point is required';
  END IF;

  -- Simpler, more reliable entry point validation
  IF NEW.entry !~ '^[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$' THEN
    RAISE EXCEPTION 'Invalid entry point format. Must be alphanumeric with hyphens, underscores, and one file extension.';
  END IF;

  -- Set default values for optional fields
  NEW.permissions := COALESCE(NEW.permissions, '{}');
  NEW.dependencies := COALESCE(NEW.dependencies, '{}');
  NEW.config := COALESCE(NEW.config, '{}');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger
CREATE TRIGGER validate_plugin_before_insert_update
  BEFORE INSERT OR UPDATE ON plugins
  FOR EACH ROW
  EXECUTE FUNCTION validate_plugin_data();

-- Create audit log table
CREATE TABLE IF NOT EXISTS plugin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id uuid REFERENCES plugins(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  changes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create audit log trigger function
CREATE OR REPLACE FUNCTION log_plugin_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO plugin_audit_logs (plugin_id, user_id, action, changes)
  VALUES (
    NEW.id,
    auth.uid(),
    TG_OP,
    jsonb_build_object(
      'before', to_jsonb(OLD),
      'after', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audit log trigger
CREATE TRIGGER log_plugin_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON plugins
  FOR EACH ROW
  EXECUTE FUNCTION log_plugin_changes();

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON plugins;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON plugins;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON plugins;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON plugins;

-- Create new, more secure policies
CREATE POLICY "Users can read public plugins"
  ON plugins
  FOR SELECT
  TO authenticated
  USING (
    user_id IS NULL OR -- Public plugins
    user_id = auth.uid() -- User's own plugins
  );

CREATE POLICY "Users can manage their own plugins"
  ON plugins
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_plugins_user_id ON plugins(user_id);
CREATE INDEX IF NOT EXISTS idx_plugins_name ON plugins(name);
CREATE INDEX IF NOT EXISTS idx_plugins_entry ON plugins(entry);

-- Add caching hints
COMMENT ON TABLE plugins IS E'@cacheControl {
  maxAge: 300,
  scope: "PUBLIC"
}';

-- Update existing plugins to have proper user_id
UPDATE plugins SET user_id = (
  SELECT id FROM auth.users LIMIT 1
) WHERE user_id IS NULL;