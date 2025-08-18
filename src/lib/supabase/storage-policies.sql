-- Storage policies for all buckets

-- Destinations bucket
CREATE POLICY "Allow public viewing of destinations" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'destinations');

CREATE POLICY "Allow authenticated uploads to destinations" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'destinations');

-- Packages bucket
CREATE POLICY "Allow public viewing of packages" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'packages');

CREATE POLICY "Allow authenticated uploads to packages" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'packages');

-- Offers bucket
CREATE POLICY "Allow public viewing of offers" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'offers');

CREATE POLICY "Allow authenticated uploads to offers" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'offers');

-- Departments bucket
CREATE POLICY "Allow public viewing of departments" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'departments');

CREATE POLICY "Allow authenticated uploads to departments" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'departments');

-- Events bucket
CREATE POLICY "Allow public viewing of events" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'events');

CREATE POLICY "Allow authenticated uploads to events" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'events');

-- Fixed departures bucket
CREATE POLICY "Allow public viewing of fixed-departures" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'fixed-departures');

CREATE POLICY "Allow authenticated uploads to fixed-departures" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'fixed-departures');

-- Testimonials bucket
CREATE POLICY "Allow public viewing of testimonials" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'testimonials');

CREATE POLICY "Allow authenticated uploads to testimonials" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'testimonials');

-- Pages bucket
CREATE POLICY "Allow public viewing of pages" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'pages');

CREATE POLICY "Allow authenticated uploads to pages" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'pages');
