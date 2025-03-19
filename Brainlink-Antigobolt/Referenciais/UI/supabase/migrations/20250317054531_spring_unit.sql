/*
  # Fix Plugins RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow:
      - All authenticated users to read plugins
      - All authenticated users to manage plugins
    - Remove admin-only restriction

  2. Security
    - Maintain RLS enabled
    - Allow broader access for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read plugins" ON plugins;
DROP POLICY IF EXISTS "Only admins can manage plugins" ON plugins;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
  ON plugins
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON plugins
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON plugins
  FOR DELETE
  TO authenticated
  USING (true);