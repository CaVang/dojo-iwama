"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type UserRole = "admin" | "content_moderator" | "dojo_chief" | "user" | null;

interface Permission {
  id: string;
  name: string;
  category: string;
}

interface Role {
  name: string;
  display_name: string;
  priority: number;
}

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  managed_dojo_id: string | null;
  role_id: string | null;
  role?: Role;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole;
  permissions: string[]; // List of permission IDs
  isAdmin: boolean;
  isContentModerator: boolean;
  isDojoChief: boolean;
  isLoading: boolean;
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        // Fetch profile with role
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select(
            `
          *,
          role:roles(name, display_name, priority)
        `,
          )
          .eq("id", userId)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);

          // Fetch permissions for this role
          if (profileData.role_id) {
            const { data: permData } = await supabase
              .from("role_permissions")
              .select("permission_id")
              .eq("role_id", profileData.role_id);

            if (permData) {
              setPermissions(permData.map((p: { permission_id: string }) => p.permission_id));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let mounted = true;

    // Use onAuthStateChange as primary — it fires immediately with
    // the current session and does NOT use the Web Locks API.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      if (!mounted) return;

      // ==========================================
      // SIMULATION MODE FOR LOCAL DEVELOPMENT 
      // ==========================================
      if (process.env.NODE_ENV === "development") {
        const match = document.cookie.match(new RegExp('(^| )dev_simulated_role=([^;]+)'));
        const simulatedRole = match ? match[2] : null;

        if (simulatedRole && simulatedRole !== "guest") {
          console.warn(`Local Dev Auth Overridden with role: ${simulatedRole}`);
          
          // Mock a user session
          setSession({} as Session);
          setUser({ id: "dev-simulated-user-id", email: "dev@example.com" } as User);
          
          // Mock the profile to match internal state checks
          setProfile({
            id: "dev-simulated-user-id",
            role: { name: simulatedRole, display_name: "Simulated Role", priority: 1 },
          } as Profile);
          
          // Mock full permissions to avoid UI blockers
          setPermissions(["admin.full_access"]);
          setIsLoading(false);
          return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setPermissions([]);
      }

      setIsLoading(false);
    });

    // Safety timeout: if onAuthStateChange never fires (edge case),
    // ensure the app doesn't stay in loading state forever.
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Permission check helpers
  const hasPermission = (permissionId: string): boolean => {
    return (
      permissions.includes(permissionId) ||
      permissions.includes("admin.full_access")
    );
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (permissions.includes("admin.full_access")) return true;
    return permissionIds.some((id) => permissions.includes(id));
  };

  const role: UserRole = (profile?.role?.name as UserRole) ?? null;
  const isAdmin = role === "admin";
  const isContentModerator = role === "content_moderator" || isAdmin;
  const isDojoChief = role === "dojo_chief" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role,
        permissions,
        isAdmin,
        isContentModerator,
        isDojoChief,
        isLoading,
        hasPermission,
        hasAnyPermission,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Permission constants for easy reference
export const PERMISSIONS = {
  // Content
  CONTENT_CREATE: "content.create",
  CONTENT_EDIT_OWN: "content.edit_own",
  CONTENT_EDIT_ANY: "content.edit_any",
  CONTENT_DELETE_OWN: "content.delete_own",
  CONTENT_DELETE_ANY: "content.delete_any",
  CONTENT_PUBLISH: "content.publish",
  CONTENT_APPROVE: "content.approve",

  // Comments
  COMMENT_CREATE: "comment.create",
  COMMENT_EDIT_OWN: "comment.edit_own",
  COMMENT_DELETE_OWN: "comment.delete_own",
  COMMENT_DELETE_ANY: "comment.delete_any",
  COMMENT_APPROVE: "comment.approve",

  // Dojo
  DOJO_VIEW: "dojo.view",
  DOJO_SUBMIT: "dojo.submit",
  DOJO_EDIT_OWN: "dojo.edit_own",
  DOJO_APPROVE: "dojo.approve",
  DOJO_MANAGE_ANY: "dojo.manage_any",

  // Events
  EVENT_VIEW: "event.view",
  EVENT_CREATE: "event.create",
  EVENT_EDIT_OWN: "event.edit_own",
  EVENT_MANAGE_ANY: "event.manage_any",

  // Users
  USER_VIEW_PROFILES: "user.view_profiles",
  USER_MANAGE_ROLES: "user.manage_roles",
  USER_BAN: "user.ban",

  // Techniques
  TECHNIQUE_VIEW: "technique.view",
  TECHNIQUE_CREATE: "technique.create",
  TECHNIQUE_EDIT: "technique.edit",
  TECHNIQUE_DELETE: "technique.delete",

  // Admin
  ADMIN_DASHBOARD: "admin.dashboard",
  ADMIN_SETTINGS: "admin.settings",
  ADMIN_FULL_ACCESS: "admin.full_access",
} as const;
