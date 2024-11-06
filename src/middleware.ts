import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
   const token = request.cookies.get("auth_token")?.value;

   if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token || !verifyToken(token)) {
         return NextResponse.redirect(new URL("/signin", request.url));
      }
   }

   return NextResponse.next();
}

export const config = {
   matcher: "/dashboard/:path*",
};
