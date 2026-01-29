-- =============================================
-- MIGRATION: Add grading technique fields
-- Run this in Supabase SQL Editor BEFORE running seed.sql
-- =============================================

-- Add new columns to techniques table if they don't exist
DO $$ 
BEGIN
  -- Add type column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'techniques' AND column_name = 'type') THEN
    ALTER TABLE public.techniques ADD COLUMN type TEXT DEFAULT 'foundational';
  END IF;

  -- Add attack column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'techniques' AND column_name = 'attack') THEN
    ALTER TABLE public.techniques ADD COLUMN attack TEXT;
  END IF;

  -- Add base_technique column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'techniques' AND column_name = 'base_technique') THEN
    ALTER TABLE public.techniques ADD COLUMN base_technique TEXT;
  END IF;

  -- Add belt_levels column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'techniques' AND column_name = 'belt_levels') THEN
    ALTER TABLE public.techniques ADD COLUMN belt_levels JSONB DEFAULT '[]';
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_techniques_type ON public.techniques(type);
CREATE INDEX IF NOT EXISTS idx_techniques_attack ON public.techniques(attack);
CREATE INDEX IF NOT EXISTS idx_techniques_base_technique ON public.techniques(base_technique);

-- Update RLS policies if needed (optional, existing policies should work)
