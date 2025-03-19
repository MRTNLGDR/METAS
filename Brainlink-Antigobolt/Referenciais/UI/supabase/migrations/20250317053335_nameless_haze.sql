/*
  # Create Plugins Table

  1. New Tables
    - `plugins`: Stores plugin configurations and metadata
      - `id` (uuid, primary key)
      - `name` (text)
      - `version` (text)
      - `description` (text)
      - `author` (text)
      - `icon` (text, optional)
      - `entry` (text)
      - `permissions` (text[])
      - `dependencies` (jsonb)
      - `config` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL,
  description text NOT NULL,
  author text NOT NULL,
  icon text,
  entry text NOT NULL,
  permissions text[] DEFAULT '{}',
  dependencies jsonb DEFAULT '{}',
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read plugins"
  ON plugins
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage plugins"
  ON plugins
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE TRIGGER update_plugins_updated_at
  BEFORE UPDATE ON plugins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();