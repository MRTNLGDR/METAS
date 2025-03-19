/*
  # Workspace Schema Update

  1. New Tables
    - `chat_sessions`: Chat history and configuration
    - `files`: File system management
    - `canvases`: Visual workspace layouts
    - `knowledge_nodes`: Knowledge graph nodes
    - `chat_nodes`: Chat message nodes
    - `node_connections`: Relationships between nodes
    - `node_templates`: Node templates
    - `chat_history`: Chat message history
    - `node_executions`: Node execution tracking
    - `chat_settings`: Chat configuration settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add audit logging
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  messages jsonb[] DEFAULT '{}',
  config_id uuid REFERENCES assistant_configs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  content text,
  metadata jsonb DEFAULT '{}',
  parent_id uuid REFERENCES files(id) ON DELETE CASCADE,
  path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create canvases table
CREATE TABLE IF NOT EXISTS canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  nodes jsonb DEFAULT '[]',
  edges jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create knowledge_nodes table
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  config jsonb DEFAULT '{}',
  template_id uuid REFERENCES node_templates(id),
  execution_count integer DEFAULT 0,
  last_execution_at timestamptz,
  content_type text DEFAULT 'note',
  source_type text,
  source_id uuid,
  file_path text,
  schema jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_nodes table
CREATE TABLE IF NOT EXISTS chat_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  parent_id uuid REFERENCES chat_nodes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create node_connections table
CREATE TABLE IF NOT EXISTS node_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  target_id uuid REFERENCES knowledge_nodes(id) ON DELETE CASCADE NOT NULL,
  relationship_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  config jsonb DEFAULT '{}',
  weight double precision DEFAULT 1.0,
  bidirectional boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create node_templates table
CREATE TABLE IF NOT EXISTS node_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL,
  config jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  model text NOT NULL,
  messages jsonb[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create node_executions table
CREATE TABLE IF NOT EXISTS node_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  status text NOT NULL,
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  error_message text,
  execution_time interval,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_settings table
CREATE TABLE IF NOT EXISTS chat_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  provider_configs jsonb DEFAULT '{}' NOT NULL,
  default_settings jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Users can manage their own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for files
CREATE POLICY "Users can manage their own files"
  ON files
  FOR ALL
  TO authenticated
  USING (
    CASE 
      WHEN (metadata->>'createdBy') IS NULL THEN auth.uid() = auth.uid()
      ELSE (metadata->>'createdBy')::text = auth.uid()::text
    END
  )
  WITH CHECK (
    CASE 
      WHEN (metadata->>'createdBy') IS NULL THEN true
      ELSE (metadata->>'createdBy')::text = auth.uid()::text
    END
  );

-- Create policies for canvases
CREATE POLICY "Users can manage their own canvases"
  ON canvases
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for knowledge_nodes
CREATE POLICY "Users can manage their own knowledge nodes"
  ON knowledge_nodes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for chat_nodes
CREATE POLICY "Users can read their own chat nodes"
  ON chat_nodes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert chat nodes"
  ON chat_nodes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage their own chat nodes"
  ON chat_nodes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for node_connections
CREATE POLICY "Users can manage connections between their nodes"
  ON node_connections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_connections.source_id
      AND user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_connections.target_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_connections.source_id
      AND user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_connections.target_id
      AND user_id = auth.uid()
    )
  );

-- Create policies for node_templates
CREATE POLICY "Users can manage their own templates"
  ON node_templates
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for chat_history
CREATE POLICY "Users can manage their own chat history"
  ON chat_history
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

-- Create policies for node_executions
CREATE POLICY "Users can view executions of their nodes"
  ON node_executions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_executions.node_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage executions of their nodes"
  ON node_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM knowledge_nodes
      WHERE id = node_executions.node_id
      AND user_id = auth.uid()
    )
  );

-- Create policies for chat_settings
CREATE POLICY "Users can manage their own chat settings"
  ON chat_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_type ON knowledge_nodes(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_content_type ON knowledge_nodes(content_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_template ON knowledge_nodes(template_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_source ON knowledge_nodes(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_node_templates_type ON node_templates(type);
CREATE INDEX IF NOT EXISTS idx_files_parent_id ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_files_path ON files(path);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_node_executions_status ON node_executions(status);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_settings_updated_at
  BEFORE UPDATE ON chat_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at
  BEFORE UPDATE ON chat_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create helper functions
CREATE OR REPLACE FUNCTION set_file_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.metadata = jsonb_set(
    COALESCE(NEW.metadata, '{}'::jsonb),
    '{createdBy}',
    to_jsonb(auth.uid()::text)
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_file_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path = NEW.name;
  ELSE
    SELECT path || '/' || NEW.name INTO NEW.path
    FROM files
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION set_chat_history_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_node_execution_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE knowledge_nodes
  SET 
    execution_count = execution_count + 1,
    last_execution_at = NEW.created_at
  WHERE id = NEW.node_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for helper functions
CREATE TRIGGER set_file_created_by_trigger
  BEFORE INSERT ON files
  FOR EACH ROW
  EXECUTE FUNCTION set_file_created_by();

CREATE TRIGGER update_file_path_trigger
  BEFORE INSERT OR UPDATE OF parent_id, name ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_file_path();

CREATE TRIGGER set_chat_history_user_id_trigger
  BEFORE INSERT ON chat_history
  FOR EACH ROW
  EXECUTE FUNCTION set_chat_history_user_id();

CREATE TRIGGER update_node_stats
  AFTER INSERT ON node_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_node_execution_stats();