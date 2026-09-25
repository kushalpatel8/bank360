import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = (req: any) => {
  const path = req.nextUrl.pathname;
  return path === '/' || 
         path === '/role-selection' || 
         /^\/sign-in/.test(path) || 
         /^\/sign-up/.test(path) || 
         /^\/api\/webhook/.test(path);
};

const isAdminRoute = (req: any) => /^\/admin/.test(req.nextUrl.pathname);

const isAnalystRoute = (req: any) => {
  const path = req.nextUrl.pathname;
  return /^\/analytics/.test(path) || 
         /^\/segmentation/.test(path) || 
         /^\/churn/.test(path) || 
         /^\/risk/.test(path);
};

const isRMRoute = (req: any) => {
  const path = req.nextUrl.pathname;
  return /^\/customers/.test(path) || 
         /^\/interactions/.test(path) || 
         /^\/follow-ups/.test(path) || 
         /^\/ai-assistant/.test(path);
};

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();
  const userId = authObject.userId;
  
  const roleQuery = req.nextUrl.searchParams.get('role');
  const path = req.nextUrl.pathname;

  // 1. If not authenticated and visiting a protected route, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  let response = NextResponse.next();

  // 0. Instant Role Persistence via Cookies
  if (path.startsWith('/sign-up') && roleQuery) {
    response.cookies.set('user_role', roleQuery, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  // 2. Enforce Role-Based Access Control (RBAC)
  if (userId) {
    const role = (authObject.sessionClaims?.metadata as any)?.role as string | undefined || req.cookies.get('user_role')?.value;

    if (!role) {
      if (path === '/' || path === '/role-selection') {
        return response;
      }
      return NextResponse.redirect(new URL('/role-selection', req.url));
    }

    if (path === '/role-selection') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isAdminRoute(req) && role !== "administrator") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect Analyst routes
    if (isAnalystRoute(req)) {
      if (role === "analyst") {
        // full access
      } else if (role === "administrator" && req.nextUrl.pathname.startsWith("/analytics")) {
        // admin only gets analytics
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Protect RM routes
    if (isRMRoute(req)) {
      if (role === "relationship_manager" || role === "analyst") {
        // RM & Analyst full access
      } else if (role === "administrator" && req.nextUrl.pathname.startsWith("/customers")) {
        // admin only gets customers
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
