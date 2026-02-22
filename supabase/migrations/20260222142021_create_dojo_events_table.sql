-- Create dojo_events table
CREATE TABLE IF NOT EXISTS public.dojo_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dojo_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location VARCHAR,
    image_url VARCHAR,
    event_type VARCHAR DEFAULT 'miscellaneous', -- e.g., 'seminar', 'grading', 'news'
    instructor VARCHAR,
    status VARCHAR DEFAULT 'published', -- 'draft', 'published', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at (reusing the function we previously created)
CREATE TRIGGER update_dojo_events_updated_at
    BEFORE UPDATE ON public.dojo_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.dojo_events ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- RLS POLICIES FOR DOJO_EVENTS
-- --------------------------------------------------------

-- Select Policy (Public Read)
CREATE POLICY "Anyone can view dojo events" 
ON public.dojo_events FOR SELECT 
USING (true);

-- Insert Policy
CREATE POLICY "Dojo Owners can create events for their dojo" 
ON public.dojo_events FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_id
    )
);

-- Update Policy
CREATE POLICY "Dojo Owners can update their dojo events" 
ON public.dojo_events FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_events.dojo_id
    )
);

-- Delete Policy
CREATE POLICY "Dojo Owners can delete their dojo events" 
ON public.dojo_events FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_events.dojo_id
    )
);
