-- Create dojo_owners table
CREATE TABLE IF NOT EXISTS public.dojo_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dojo_id VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, dojo_id)
);

-- Enable RLS
ALTER TABLE public.dojo_owners ENABLE ROW LEVEL SECURITY;

-- Policy for dojo_owners: Admins can do everything, owners can view their own
CREATE POLICY "Users can view their own dojo ownership"
    ON public.dojo_owners
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Update dojo_registrations RLS policies
-- Note: We previously created a policy allowing authenticated users full access.
-- Now we need to refine it to only allow owners to access their dojo's registrations.

-- First, drop the broad authenticated policy created earlier
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.dojo_registrations;

-- Policy: Owners can view their dojo's registrations
CREATE POLICY "Owners can view their dojo registrations"
    ON public.dojo_registrations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojo_registrations.dojo_id
        )
    );

-- Policy: Owners can update their dojo's registrations (e.g. status)
CREATE POLICY "Owners can update their dojo registrations"
    ON public.dojo_registrations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojo_registrations.dojo_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojo_registrations.dojo_id
        )
    );

-- Policy: Owners can delete their dojo's registrations
CREATE POLICY "Owners can delete their dojo registrations"
    ON public.dojo_registrations
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.dojo_owners
            WHERE dojo_owners.user_id = auth.uid()
            AND dojo_owners.dojo_id = dojo_registrations.dojo_id
        )
    );
