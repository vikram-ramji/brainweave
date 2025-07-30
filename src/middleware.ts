import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Define public and authentication-related paths
const PUBLIC_PATHS = ["/"];
const AUTH_PATHS = ["/sign-in", "/sign-up", "/signup-confirmation"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (sessionCookie) {
    // If the user is logged in and tries to access an auth page or the public landing page,
    // redirect them to the dashboard.
    if (isAuthPath || isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // If the user is not logged in and is trying to access a protected page (i.e., not public or auth),
    // redirect them to the sign-in page.
    if (!isPublicPath && !isAuthPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any other static assets (e.g., .svg, .png)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
