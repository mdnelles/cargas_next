import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
   try {
      // Get the session token from the cookie
      const sessionToken = req.headers
         .get("Cookie")
         ?.split(";")
         .find((c) => c.trim().startsWith("auth_token="))
         ?.split("=")[1];

      if (!sessionToken) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Verify the session token (you may need to implement this function)
      const user = await verifySessionToken(sessionToken);

      if (!user) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { name, email, country, currentPassword, newPassword } =
         await req.json();

      // Basic validation
      if (!name || !email || !country) {
         return NextResponse.json(
            { message: "Name, email, and country are required" },
            { status: 400 }
         );
      }

      // Get the current user's data from the database
      const [users]: any = await pool.query(
         "SELECT * FROM users WHERE id = ?",
         [user.id]
      );

      if (!users || users.length === 0) {
         return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
         );
      }

      const currentUser = users[0];

      // If the user is trying to change their password
      if (currentPassword && newPassword) {
         // Verify the current password
         const isPasswordValid = await bcrypt.compare(
            currentPassword,
            currentUser.password
         );
         if (!isPasswordValid) {
            return NextResponse.json(
               { message: "Current password is incorrect" },
               { status: 400 }
            );
         }

         // Hash the new password
         const hashedNewPassword = await bcrypt.hash(newPassword, 10);

         // Update user information including the new password
         await pool.query(
            "UPDATE users SET name = ?, email = ?, country = ?, password = ? WHERE id = ?",
            [name, email, country, hashedNewPassword, user.id]
         );
      } else {
         // Update user information without changing the password
         await pool.query(
            "UPDATE users SET name = ?, email = ?, country = ? WHERE id = ?",
            [name, email, country, user.id]
         );
      }

      return NextResponse.json(
         { message: "Profile updated successfully" },
         { status: 200 }
      );
   } catch (error: any) {
      console.error("Profile update error:", error);
      if (error.code === "ER_DUP_ENTRY") {
         return NextResponse.json(
            { message: "Email already exists" },
            { status: 409 }
         );
      }
      return NextResponse.json(
         { message: "An error occurred while updating the profile" },
         { status: 500 }
      );
   }
}

// You need to implement this function based on your authentication strategy
async function verifySessionToken(
   token: string
): Promise<{ id: number } | null> {
   // This is a placeholder. You should implement the actual verification logic.
   // For example, you might query the database to find a user with this session token.
   const [users]: any = await pool.query(
      "SELECT id FROM users WHERE session_token = ?",
      [token]
   );

   if (users && users.length > 0) {
      return { id: users[0].id };
   }

   return null;
}
