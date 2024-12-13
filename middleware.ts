import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/", "/sign-out(.*)","/api/webhook"]);

export default clerkMiddleware(async (auth, request) => {
  try {
    // Skip middleware completely during sign-out
    if (request.nextUrl.pathname.startsWith('/sign-out')) {
      return NextResponse.next();
    }

    const { userId, orgId } = await auth();
    
    // During auth transitions, don't redirect
    if (!userId && (
      request.nextUrl.pathname.startsWith('/sign-in') || 
      request.nextUrl.pathname.startsWith('/sign-out')
    )) {
      return NextResponse.next();
    }

    // Handle sign-out state
    if (request.nextUrl.pathname.startsWith('/sign-out')) {
      return NextResponse.next();
    }

    if (userId && isPublicRoute(request)) {
      let path = "/select-org";
      if (orgId) {
        path = `/organization/${orgId}`;
      }
      const orgSelection = new URL(path, request.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!userId && !isPublicRoute(request)) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", request.url);
      return NextResponse.redirect(orgSelection);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // On error, allow the request through but redirect to sign-in if needed
    if (request.nextUrl.pathname.startsWith('/sign-out')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};