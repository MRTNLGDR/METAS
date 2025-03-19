/*
  # Create Storage Sync System Tables

  1. New Tables (if not exist)
    - `storage_items`: Stores file metadata and sync status
    - `sync_queue`: Manages sync operations

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create storage_items table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'storage_items') THEN
    CREATE TABLE storage_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      path text NOT NULL,
      content_hash text,
      size bigint,
      metadata jsonb DEFAULT '{}',
      sync_status text NOT NULL DEFAULT 'pending',
      last_synced timestamptz,
      last_modified timestamptz DEFAULT now(),
      is_deleted boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, path)
    );
  END IF;
END $$;

-- Create sync_queue table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sync_queue') THEN
    CREATE TABLE sync_queue (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      item_id uuid REFERENCES storage_items(id) ON DELETE CASCADE,
      operation text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      attempts integer DEFAULT 0,
      error text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'storage_items' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE storage_items ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sync_queue' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create or replace policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can manage their own storage items" ON storage_items;
  DROP POLICY IF EXISTS "Users can manage their own sync queue" ON sync_queue;

  -- Create new policies
  CREATE POLICY "Users can manage their own storage items"
    ON storage_items
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

  CREATE POLICY "Users can manage their own sync queue"
    ON sync_queue
    FOR ALL
    TO authenticated
    USING (
      item_id IN (
        SELECT id FROM storage_items WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      item_id IN (
        SELECT id FROM storage_items WHERE user_id = auth.uid()
      )
    );
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_storage_items_user_path'
  ) THEN
    CREATE INDEX idx_storage_items_user_path ON storage_items(user_id, path);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_storage_items_sync_status'
  ) THEN
    CREATE INDEX idx_storage_items_sync_status ON storage_items(sync_status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_sync_queue_status'
  ) THEN
    CREATE INDEX idx_sync_queue_status ON sync_queue(status);
  END IF;
END $$;

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_storage_items_updated_at'
  ) THEN
    CREATE TRIGGER update_storage_items_updated_at
      BEFORE UPDATE ON storage_items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_sync_queue_updated_at'
  ) THEN
    CREATE TRIGGER update_sync_queue_updated_at
      BEFORE UPDATE ON sync_queue
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;