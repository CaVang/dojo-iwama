-- Add current_belt and tuition_paid_until to dojo_students
ALTER TABLE public.dojo_students 
ADD COLUMN IF NOT EXISTS current_belt VARCHAR DEFAULT '6_kyu',
ADD COLUMN IF NOT EXISTS tuition_paid_until DATE;

-- Update the existing students row level security is already handled by the dojo_students policies,
-- which cover UPDATE operations, so no new policies are needed.
