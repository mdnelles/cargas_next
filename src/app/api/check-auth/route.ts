import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
   const cookieStore = await cookies();
   const token = cookieStore.get("auth_token");

   if (token && verifyToken(token.value)) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
   } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
   }
}
