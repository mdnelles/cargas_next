import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, createToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
   const cookieStore = await cookies();
   const token = cookieStore.get("auth_token");

   if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
   }

   try {
      const decoded = verifyToken(token.value);
      return NextResponse.json({
         name: decoded.name,
         email: decoded.email,
         country: decoded.country,
      });
   } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
   }
}

export async function PUT(request: NextRequest) {
   const cookieStore = await cookies();
   const token = cookieStore.get("auth_token");

   if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
   }

   try {
      const decoded = verifyToken(token.value);
      const { name, email, country } = await request.json();

      // Here, you would typically update the user information in your database
      // For this example, we'll just return the updated information

      // Update the token with the new information
      const updatedToken = createToken({
         userId: decoded.userId,
         name,
         email,
         country,
      });

      const response = NextResponse.json({
         message: "Profile updated successfully",
      });
      response.cookies.set("auth_token", updatedToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 86400, // 1 day
         path: "/",
      });

      return response;
   } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
         { error: "Failed to update profile" },
         { status: 500 }
      );
   }
}
