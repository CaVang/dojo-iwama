-- =============================================
-- SUPABASE DATABASE SCHEMA FOR DOJO-IWAMA
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. PERMISSIONS TABLE (Granular, extensible)
-- =============================================
CREATE TABLE IF NOT EXISTS public.permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- group permissions by feature area
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert all granular permissions
INSERT INTO public.permissions (id, name, description, category) VALUES
  -- Content Management
  ('content.create', 'Create Content', 'Create new posts, articles, topics', 'content'),
  ('content.edit_own', 'Edit Own Content', 'Edit own created content', 'content'),
  ('content.edit_any', 'Edit Any Content', 'Edit any content (moderator)', 'content'),
  ('content.delete_own', 'Delete Own Content', 'Delete own created content', 'content'),
  ('content.delete_any', 'Delete Any Content', 'Delete any content (moderator)', 'content'),
  ('content.publish', 'Publish Content', 'Publish content without approval', 'content'),
  ('content.approve', 'Approve Content', 'Approve pending content submissions', 'content'),
  
  -- Comments
  ('comment.create', 'Create Comments', 'Post comments on content', 'comment'),
  ('comment.edit_own', 'Edit Own Comments', 'Edit own comments', 'comment'),
  ('comment.delete_own', 'Delete Own Comments', 'Delete own comments', 'comment'),
  ('comment.delete_any', 'Delete Any Comments', 'Moderate/delete any comments', 'comment'),
  ('comment.approve', 'Approve Comments', 'Approve pending comments', 'comment'),
  
  -- Dojo Management
  ('dojo.view', 'View Dojos', 'View all dojos', 'dojo'),
  ('dojo.submit', 'Submit Dojo', 'Submit new dojo for approval', 'dojo'),
  ('dojo.edit_own', 'Edit Own Dojo', 'Edit own managed dojo', 'dojo'),
  ('dojo.approve', 'Approve Dojos', 'Approve dojo submissions', 'dojo'),
  ('dojo.manage_any', 'Manage Any Dojo', 'Full dojo management access', 'dojo'),
  
  -- Events
  ('event.view', 'View Events', 'View all events', 'event'),
  ('event.create', 'Create Events', 'Create events for own dojo', 'event'),
  ('event.edit_own', 'Edit Own Events', 'Edit own created events', 'event'),
  ('event.manage_any', 'Manage Any Event', 'Full event management access', 'event'),
  
  -- Users
  ('user.view_profiles', 'View Profiles', 'View other user profiles', 'user'),
  ('user.manage_roles', 'Manage Roles', 'Assign/remove user roles', 'user'),
  ('user.ban', 'Ban Users', 'Ban/unban users', 'user'),
  
  -- Techniques
  ('technique.view', 'View Techniques', 'View technique library', 'technique'),
  ('technique.create', 'Create Techniques', 'Add new techniques', 'technique'),
  ('technique.edit', 'Edit Techniques', 'Edit existing techniques', 'technique'),
  ('technique.delete', 'Delete Techniques', 'Delete techniques', 'technique'),
  
  -- Admin
  ('admin.dashboard', 'Admin Dashboard', 'Access admin dashboard', 'admin'),
  ('admin.settings', 'System Settings', 'Modify system settings', 'admin'),
  ('admin.full_access', 'Full Admin Access', 'Super admin - all permissions', 'admin')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. ROLES TABLE (Extensible)
-- =============================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- system roles cannot be deleted
  priority INT DEFAULT 0, -- higher = more authority
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, display_name, description, is_system, priority) VALUES
  ('admin', 'Administrator', 'Full system access', TRUE, 100),
  ('content_moderator', 'Content Moderator', 'Reviews and approves user-generated content', TRUE, 80),
  ('dojo_chief', 'Dojo Chief', 'Manages own dojo, creates events and content', TRUE, 60),
  ('user', 'User', 'Regular registered user', TRUE, 10)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. ROLE_PERMISSIONS TABLE (Many-to-Many)
-- =============================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Assign permissions to roles
-- ADMIN: all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- CONTENT_MODERATOR permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'content_moderator'
  AND p.id IN (
    'content.edit_any', 'content.delete_any', 'content.approve',
    'comment.delete_any', 'comment.approve',
    'user.view_profiles'
  )
ON CONFLICT DO NOTHING;

-- DOJO_CHIEF permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'dojo_chief'
  AND p.id IN (
    'content.create', 'content.edit_own', 'content.delete_own',
    'comment.create', 'comment.edit_own', 'comment.delete_own',
    'dojo.view', 'dojo.submit', 'dojo.edit_own',
    'event.view', 'event.create', 'event.edit_own'
  )
ON CONFLICT DO NOTHING;

-- USER permissions (basic)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'user'
  AND p.id IN (
    'comment.create', 'comment.edit_own', 'comment.delete_own',
    'dojo.view', 'event.view', 'technique.view', 'user.view_profiles'
  )
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. PROFILES TABLE (Links to user's role)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  managed_dojo_id TEXT, -- For dojo_chief: which dojo they manage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on user signup with default 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id UUID;
BEGIN
  -- Get the default 'user' role ID
  SELECT id INTO default_role_id FROM public.roles WHERE name = 'user';
  
  INSERT INTO public.profiles (id, role_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    default_role_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 5. HELPER FUNCTIONS FOR PERMISSION CHECKING
-- =============================================

-- Check if current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.role_permissions rp ON p.role_id = rp.role_id
    WHERE p.id = auth.uid() 
      AND (rp.permission_id = permission_name OR rp.permission_id = 'admin.full_access')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user has any of the given permissions
CREATE OR REPLACE FUNCTION public.has_any_permission(permission_names TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.role_permissions rp ON p.role_id = rp.role_id
    WHERE p.id = auth.uid() 
      AND (rp.permission_id = ANY(permission_names) OR rp.permission_id = 'admin.full_access')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's role name
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT r.name 
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Legacy helper (backward compatible)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.has_permission('admin.full_access');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. CONTENT TABLES
-- =============================================

-- Techniques
CREATE TABLE IF NOT EXISTS public.techniques (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_jp TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  difficulty TEXT NOT NULL,
  description TEXT,
  variants JSONB DEFAULT '[]',
  content JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dojos
CREATE TABLE IF NOT EXISTS public.dojos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  chief_instructor TEXT,
  address TEXT,
  lat FLOAT,
  lng FLOAT,
  map_link TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'approved', -- pending, approved, rejected
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title_key TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  dojo_id TEXT REFERENCES public.dojos(id) ON DELETE SET NULL,
  description_key TEXT,
  image_url TEXT,
  event_type TEXT,
  instructor TEXT,
  related_blog_ids JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dojos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- PERMISSIONS: Public read
CREATE POLICY "Public read permissions" ON public.permissions FOR SELECT USING (true);

-- ROLES: Public read
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);

-- ROLE_PERMISSIONS: Public read
CREATE POLICY "Public read role_permissions" ON public.role_permissions FOR SELECT USING (true);

-- PROFILES
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- TECHNIQUES
CREATE POLICY "Public read techniques" ON public.techniques FOR SELECT USING (true);
CREATE POLICY "Create techniques" ON public.techniques FOR INSERT 
  WITH CHECK (public.has_permission('technique.create'));
CREATE POLICY "Edit techniques" ON public.techniques FOR UPDATE 
  USING (public.has_permission('technique.edit'));
CREATE POLICY "Delete techniques" ON public.techniques FOR DELETE 
  USING (public.has_permission('technique.delete'));

-- DOJOS
CREATE POLICY "Read approved dojos" ON public.dojos FOR SELECT 
  USING (status = 'approved' OR public.has_permission('dojo.approve'));
CREATE POLICY "Submit dojo" ON public.dojos FOR INSERT 
  WITH CHECK (public.has_permission('dojo.submit'));
CREATE POLICY "Edit own dojo" ON public.dojos FOR UPDATE 
  USING (
    (public.has_permission('dojo.edit_own') AND submitted_by = auth.uid())
    OR public.has_permission('dojo.manage_any')
  );
CREATE POLICY "Manage any dojo" ON public.dojos FOR DELETE 
  USING (public.has_permission('dojo.manage_any'));

-- EVENTS
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Create events" ON public.events FOR INSERT 
  WITH CHECK (public.has_permission('event.create'));
CREATE POLICY "Edit own events" ON public.events FOR UPDATE 
  USING (
    (public.has_permission('event.edit_own') AND created_by = auth.uid())
    OR public.has_permission('event.manage_any')
  );
CREATE POLICY "Manage any event" ON public.events FOR DELETE 
  USING (public.has_permission('event.manage_any'));

-- =============================================
-- 8. INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_techniques_category ON public.techniques(category);
CREATE INDEX IF NOT EXISTS idx_techniques_slug ON public.techniques(slug);
CREATE INDEX IF NOT EXISTS idx_dojos_status ON public.dojos(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
