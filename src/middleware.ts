// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
   // Get the pathname of the request
   const path = request.nextUrl.pathname;

   // Get the token from the cookies
   const token = request.cookies.get("auth_token")?.value;

   // Define public paths that don't require authentication
   const publicPaths = [
      "/forgot-password",
      "/privacy",
      "/reset-password",
      "/signin",
      "/signup",
      "/terms",
   ]; // Add more public paths as needed
   const isPublicPath =
      publicPaths.includes(path) || !path.startsWith("/dashboard");

   // If we have a token and user is trying to access login/signup, redirect to dashboard
   if (token && isPublicPath) {
      try {
         const decoded = verifyToken(token);
         if (decoded) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
         }
      } catch (error) {
         // If token verification fails, continue to public path
      }
   }

   // If we don't have a token and the path is not public, redirect to login
   if (!token && !isPublicPath) {
      const loginUrl = new URL("/signin", request.url);
      // Preserve the original destination to redirect after login
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
   }

   return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public folder
       */
      "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
   ],
};
