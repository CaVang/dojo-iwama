import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase auth cookies on the request.
  //    This modifies request cookies in-place so the session stays alive.
  //    We collect any cookies Supabase wants to set on the response.
  const cookiesToSet: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          // Update request cookies so downstream code sees fresh values
          cookies.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          // Collect cookies to set on the final response
          cookiesToSet.push(
            ...cookies.map(({ name, value, options }) => ({
              name,
              value,
              options: options as Record<string, unknown>,
            })),
          );
        },
      },
    },
  );

  // Trigger session refresh (reads/writes cookies as needed)
  await supabase.auth.getUser();

  // 2. Run next-intl middleware (handles locale routing & redirects)
  const response = intlMiddleware(request);

  // 3. Apply Supabase cookies to the final response
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes (/api/...)
  // - Next.js internals (_next/...)
  // - Static files (.*\.*)
  matcher: ["/", "/(vi|en)/:path*"],
};
