-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.dojo_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id) -- Prevent duplicate registrations
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- RLS POLICIES FOR EVENT_REGISTRATIONS
-- --------------------------------------------------------

-- Select Policy (Users can see their own registrations)
CREATE POLICY "Users can view their own event registrations" 
ON public.event_registrations FOR SELECT 
USING (auth.uid() = user_id);

-- Insert Policy (Users can register themselves)
CREATE POLICY "Users can register for events" 
ON public.event_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Delete Policy (Users can unregister themselves)
CREATE POLICY "Users can unregister themselves" 
ON public.event_registrations FOR DELETE 
USING (auth.uid() = user_id);
