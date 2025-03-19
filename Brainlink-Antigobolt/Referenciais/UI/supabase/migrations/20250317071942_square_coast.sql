/*
  # Add Notes Table

  1. New Tables
    - `notes`: Stores user notes
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Add trigger for user_id
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS notes CASCADE;

-- Create notes table
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy for notes
CREATE POLICY "Users can manage their own notes"
  ON notes
  FOR ALL
  TO authenticated
  USING (
    CASE
      WHEN user_id IS NULL THEN auth.uid() = auth.uid()
      ELSE user_id = auth.uid()
    END
  )
  WITH CHECK (
    CASE
      WHEN user_id IS NULL THEN true
      ELSE user_id = auth.uid()
    END
  );

-- Create trigger function to set user_id
CREATE OR REPLACE FUNCTION set_notes_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_notes_user_id_trigger
  BEFORE INSERT ON notes
  FOR EACH ROW
  EXECUTE FUNCTION set_notes_user_id();