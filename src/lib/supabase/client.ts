import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Disable Web Locks to prevent deadlock caused by
        // React Strict Mode double-mount in Next.js.
        // Without this, getSession() (called internally by ALL
        // Supabase queries to attach auth headers) hangs forever.
        lock: async <R>(
          _name: string,
          _acquireTimeout: number,
          fn: () => Promise<R>,
        ): Promise<R> => {
          return fn();
        },
      },
    },
  );

  return client;
}
