-- 1. Create dojo_classes table
CREATE TABLE IF NOT EXISTS public.dojo_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dojo_id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    target_audience VARCHAR NOT NULL DEFAULT 'all', -- 'kids', 'teens', 'adults', 'all'
    tuition_1m NUMERIC DEFAULT 0,
    tuition_3m NUMERIC DEFAULT 0,
    tuition_6m NUMERIC DEFAULT 0,
    tuition_12m NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create class_schedules table
CREATE TABLE IF NOT EXISTS public.class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.dojo_classes(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create dojo_students table
CREATE TABLE IF NOT EXISTS public.dojo_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dojo_id VARCHAR NOT NULL,
    class_id UUID REFERENCES public.dojo_classes(id) ON DELETE SET NULL,
    registration_id UUID REFERENCES public.dojo_registrations(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    contact_info VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_dojo_classes_updated_at
    BEFORE UPDATE ON public.dojo_classes
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_class_schedules_updated_at
    BEFORE UPDATE ON public.class_schedules
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_dojo_students_updated_at
    BEFORE UPDATE ON public.dojo_students
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.dojo_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dojo_students ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- RLS POLICIES FOR DOJO_CLASSES
-- Only users mapped to the Dojos in `dojo_owners` can manage
-- --------------------------------------------------------

-- Select Policy
CREATE POLICY "Dojo Owners can view their dojo classes" 
ON public.dojo_classes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_classes.dojo_id
    )
);

-- Insert Policy
CREATE POLICY "Dojo Owners can create classes for their dojo" 
ON public.dojo_classes FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_id
    )
);

-- Update Policy
CREATE POLICY "Dojo Owners can update their dojo classes" 
ON public.dojo_classes FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_classes.dojo_id
    )
);

-- Delete Policy
CREATE POLICY "Dojo Owners can delete their dojo classes" 
ON public.dojo_classes FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_classes.dojo_id
    )
);

-- --------------------------------------------------------
-- RLS POLICIES FOR CLASS_SCHEDULES
-- Relies on joining with dojo_classes
-- --------------------------------------------------------

-- Select Policy
CREATE POLICY "Dojo Owners can view schedules for their classes" 
ON public.class_schedules FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_classes c
        JOIN public.dojo_owners o ON c.dojo_id = o.dojo_id
        WHERE c.id = class_schedules.class_id
        AND o.user_id = auth.uid()
    )
);

-- Insert Policy
CREATE POLICY "Dojo Owners can create schedules for their classes" 
ON public.class_schedules FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dojo_classes c
        JOIN public.dojo_owners o ON c.dojo_id = o.dojo_id
        WHERE c.id = class_id
        AND o.user_id = auth.uid()
    )
);

-- Update Policy
CREATE POLICY "Dojo Owners can update schedules for their classes" 
ON public.class_schedules FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_classes c
        JOIN public.dojo_owners o ON c.dojo_id = o.dojo_id
        WHERE c.id = class_schedules.class_id
        AND o.user_id = auth.uid()
    )
);

-- Delete Policy
CREATE POLICY "Dojo Owners can delete schedules for their classes" 
ON public.class_schedules FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_classes c
        JOIN public.dojo_owners o ON c.dojo_id = o.dojo_id
        WHERE c.id = class_schedules.class_id
        AND o.user_id = auth.uid()
    )
);

-- --------------------------------------------------------
-- RLS POLICIES FOR DOJO_STUDENTS
-- Only users mapped to the Dojos in `dojo_owners` can manage
-- --------------------------------------------------------

-- Select Policy
CREATE POLICY "Dojo Owners can view their dojo students" 
ON public.dojo_students FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_students.dojo_id
    )
);

-- Insert Policy
CREATE POLICY "Dojo Owners can add students to their dojo" 
ON public.dojo_students FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_id
    )
);

-- Update Policy
CREATE POLICY "Dojo Owners can update their dojo students" 
ON public.dojo_students FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_students.dojo_id
    )
);

-- Delete Policy
CREATE POLICY "Dojo Owners can delete their dojo students" 
ON public.dojo_students FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.dojo_owners 
        WHERE user_id = auth.uid() 
        AND dojo_id = dojo_students.dojo_id
    )
);
