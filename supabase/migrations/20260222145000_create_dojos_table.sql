-- Create dojos table to store dojo profile information
CREATE TABLE IF NOT EXISTS public.dojos (
    id VARCHAR PRIMARY KEY,
    name TEXT NOT NULL,
    chief_instructor TEXT,
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    background_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.dojos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view dojos (public data)
CREATE POLICY "Anyone can view dojos"
    ON public.dojos
    FOR SELECT
    TO public
    USING (true);

-- Policy: Dojo owners can update their own dojo
CREATE POLICY "Owners can update their own dojo"
    ON public.dojos
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojos.id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojos.id
        )
    );

-- Policy: Dojo owners can insert their own dojo
CREATE POLICY "Owners can insert their own dojo"
    ON public.dojos
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojos.id
        )
    );

-- Seed with existing static data
INSERT INTO public.dojos (id, name, chief_instructor, address, lat, lng, phone, email, description) VALUES
('iwama-honbu', 'Iwama Shin-Shin Aiki Shuren-kai Honbu Dojo', 'Hitohira Saito Sensei', '2289-1 Yoshioka, Iwama-machi, Kasama-shi, Ibaraki-ken 319-0203, Japan', 36.3583, 140.2864, '+81-299-45-2224', 'info@iwamaaikido.com', 'The birthplace of Iwama style Aikido, where O-Sensei spent his later years developing the art in harmony with nature.'),
('tanrenkan-california', 'Tanrenkan Dojo - California', 'Miles Kessler Sensei', '1234 Aikido Way, San Francisco, CA 94102, USA', 37.7749, -122.4194, '+1-415-555-0123', 'info@tanrenkan-ca.org', 'A traditional Iwama dojo bringing authentic teachings to the West Coast of America.'),
('takemusu-paris', 'Takemusu Aiki Paris', 'Daniel Toutain Sensei', '45 Rue de la Paix, 75002 Paris, France', 48.8566, 2.3522, '+33-1-42-65-1234', 'contact@takemusu-paris.fr', 'One of the premier Iwama Aikido dojos in Europe, dedicated to preserving the founder''s teachings.'),
('iwama-sweden', 'Iwama Ryu Sweden', 'Ulf Evenas Sensei', 'Drottninggatan 12, 111 51 Stockholm, Sweden', 59.3293, 18.0686, '+46-8-555-1234', 'info@iwama-sweden.se', 'Bringing the spirit of Iwama to Scandinavia through dedicated practice and teaching.'),
('aiki-shuren-australia', 'Aiki Shuren Dojo Melbourne', 'Tony Smibert Sensei', '78 Collins Street, Melbourne VIC 3000, Australia', -37.8136, 144.9631, '+61-3-9555-1234', 'info@aikishuren-melbourne.com.au', 'Australia''s leading Iwama style dojo, fostering the next generation of aikidoka.'),
('takemusu-germany', 'Takemusu Aikido Berlin', 'Stefan Stenudd Sensei', 'Unter den Linden 77, 10117 Berlin, Germany', 52.52, 13.405, '+49-30-555-1234', 'info@takemusu-berlin.de', 'A center of excellence for traditional Iwama Aikido in the heart of Europe.')
ON CONFLICT (id) DO NOTHING;
