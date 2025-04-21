-- Create the profile_images bucket if it doesn't exist
-- You'll need to run this in the Supabase SQL editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'profile_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to view any profile image
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_images');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
