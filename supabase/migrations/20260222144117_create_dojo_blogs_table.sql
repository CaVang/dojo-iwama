-- Create dojo_blogs table
CREATE TABLE IF NOT EXISTS public.dojo_blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dojo_id VARCHAR NOT NULL,
    event_id UUID REFERENCES public.dojo_events(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR,
    status VARCHAR DEFAULT 'published', -- 'draft', 'published'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_dojo_blogs_updated_at
    BEFORE UPDATE ON public.dojo_blogs
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.dojo_blogs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- RLS POLICIES FOR DOJO_BLOGS
-- --------------------------------------------------------

-- Select Policy (Public Read for published blogs)
CREATE POLICY "Anyone can view published blogs" 
ON public.dojo_blogs FOR SELECT 
USING (status = 'published');

-- Select Policy (Owners can view draft blogs)
CREATE POLICY "Dojo Owners can view all their blogs"
ON public.dojo_blogs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_blogs.dojo_id
    )
);

-- Insert Policy
CREATE POLICY "Dojo Owners can create blogs for their dojo" 
ON public.dojo_blogs FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_id
    )
);

-- Update Policy
CREATE POLICY "Dojo Owners can update their dojo blogs" 
ON public.dojo_blogs FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_blogs.dojo_id
    )
);

-- Delete Policy
CREATE POLICY "Dojo Owners can delete their dojo blogs" 
ON public.dojo_blogs FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_blogs.dojo_id
    )
);
