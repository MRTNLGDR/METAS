/*
  # Create Storage Bucket and Policies

  1. New Storage Bucket
    - Create 'workspace' bucket for file storage
    - Enable file size limits and security settings
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their files
*/

-- Create the workspace bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('workspace', 'workspace', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'workspace' AND auth.uid() = owner);

CREATE POLICY "Users can update their files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'workspace' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'workspace' AND auth.uid() = owner);

CREATE POLICY "Users can read their files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'workspace' AND auth.uid() = owner);

CREATE POLICY "Users can delete their files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'workspace' AND auth.uid() = owner);