/*
  # Create Roadmap Schema

  1. New Tables
    - `roadmap_items`: Stores roadmap entries and milestones
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `category` (text)
      - `due_date` (timestamptz)
      - `assigned_to` (uuid)
      - `parent_id` (uuid)
      - `order` (integer)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmap_dependencies`: Tracks dependencies between roadmap items
      - `id` (uuid, primary key)
      - `source_id` (uuid)
      - `target_id` (uuid)
      - `type` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create roadmap_items table
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned',
  priority text NOT NULL DEFAULT 'medium',
  category text NOT NULL,
  due_date timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES roadmap_items(id) ON DELETE CASCADE,
  "order" integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_status CHECK (status IN ('planned', 'in_progress', 'completed', 'blocked', 'cancelled')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_category CHECK (category IN ('feature', 'bug', 'improvement', 'milestone', 'epic'))
);

-- Create roadmap_dependencies table
CREATE TABLE IF NOT EXISTS roadmap_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'blocks',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_dependency_type CHECK (type IN ('blocks', 'requires', 'relates_to')),
  CONSTRAINT no_self_dependency CHECK (source_id != target_id),
  CONSTRAINT unique_dependency UNIQUE (source_id, target_id)
);

-- Enable RLS
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_dependencies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read roadmap items"
  ON roadmap_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage roadmap items"
  ON roadmap_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        metadata->>'role' = 'admin'
        OR metadata->>'role' = 'manager'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        metadata->>'role' = 'admin'
        OR metadata->>'role' = 'manager'
      )
    )
  );

CREATE POLICY "Users can read dependencies"
  ON roadmap_dependencies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage dependencies"
  ON roadmap_dependencies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        metadata->>'role' = 'admin'
        OR metadata->>'role' = 'manager'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        metadata->>'role' = 'admin'
        OR metadata->>'role' = 'manager'
      )
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_roadmap_items_status ON roadmap_items(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_priority ON roadmap_items(priority);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_category ON roadmap_items(category);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_due_date ON roadmap_items(due_date);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_assigned_to ON roadmap_items(assigned_to);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_parent_id ON roadmap_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_order ON roadmap_items("order");

-- Create updated_at trigger
CREATE TRIGGER update_roadmap_items_updated_at
  BEFORE UPDATE ON roadmap_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial categories
INSERT INTO roadmap_items (title, description, category, priority, status)
VALUES
  ('Project Setup', 'Initial project configuration and setup', 'milestone', 'high', 'completed'),
  ('Core Features', 'Essential features for MVP', 'epic', 'high', 'in_progress'),
  ('User Authentication', 'Implement user authentication system', 'feature', 'high', 'completed'),
  ('Database Schema', 'Design and implement database schema', 'feature', 'high', 'completed'),
  ('API Development', 'Develop REST API endpoints', 'epic', 'high', 'in_progress'),
  ('UI Components', 'Create reusable UI components', 'feature', 'medium', 'in_progress'),
  ('Testing', 'Implement testing framework and write tests', 'improvement', 'medium', 'planned'),
  ('Documentation', 'Create project documentation', 'improvement', 'medium', 'planned'),
  ('Performance Optimization', 'Optimize application performance', 'improvement', 'low', 'planned'),
  ('Deployment', 'Setup deployment pipeline', 'milestone', 'high', 'planned');