/*
  # Create Assistant Configuration Tables

  1. New Tables
    - `assistant_configs`: Stores assistant configurations
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `expertise` (text[])
      - `personality` (jsonb)
      - `knowledge` (jsonb)
      - `response_format` (jsonb)
      - `language` (jsonb)
      - `context_handling` (jsonb)
      - `model_config` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_sessions`: Stores chat session data
      - `id` (uuid, primary key)
      - `messages` (jsonb[])
      - `config_id` (uuid, references assistant_configs)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create assistant_configs table
CREATE TABLE IF NOT EXISTS assistant_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  expertise text[] DEFAULT '{}',
  personality jsonb DEFAULT '{}',
  knowledge jsonb DEFAULT '{}',
  response_format jsonb DEFAULT '{}',
  language jsonb DEFAULT '{}',
  context_handling jsonb DEFAULT '{}',
  model_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  messages jsonb[] DEFAULT '{}',
  config_id uuid REFERENCES assistant_configs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assistant_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for assistant_configs
CREATE POLICY "Users can manage their own configs"
  ON assistant_configs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for chat_sessions
CREATE POLICY "Users can manage their own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assistant_configs_updated_at
  BEFORE UPDATE ON assistant_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();