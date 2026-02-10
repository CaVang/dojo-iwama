import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run Supabase session refresh first (refreshes auth cookies)
  const supabaseResponse = await updateSession(request);

  // 2. Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request);

  // 3. Copy Supabase cookies to the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - API routes (/api/...)
  // - Next.js internals (_next/...)
  // - Static files (.*\.*)
  matcher: ["/", "/(vi|en)/:path*"],
};
