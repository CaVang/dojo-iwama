-- Create the dojo_registrations table
CREATE TABLE IF NOT EXISTS public.dojo_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dojo_id VARCHAR NOT NULL,
    dojo_name VARCHAR NOT NULL,
    contact_name VARCHAR NOT NULL,
    contact_info VARCHAR NOT NULL,
    student_age VARCHAR NOT NULL,
    message TEXT,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dojo_registrations_modtime
BEFORE UPDATE ON public.dojo_registrations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.dojo_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous users) to insert a registration
CREATE POLICY "Allow public inserts"
    ON public.dojo_registrations
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated users (admins) can view or update registrations
CREATE POLICY "Allow authenticated full access"
    ON public.dojo_registrations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
