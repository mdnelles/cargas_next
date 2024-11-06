import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
   try {
      const { name, email, country, password } = await req.json();

      // Basic validation
      if (!name || !email || !country || !password) {
         return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
         );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const [result] = await pool.query(
         "INSERT INTO users (name, email, country, password) VALUES (?, ?, ?, ?)",
         [name, email, country, hashedPassword]
      );

      return NextResponse.json(
         { message: "User created successfully" },
         { status: 201 }
      );
   } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === "ER_DUP_ENTRY") {
         return NextResponse.json(
            { message: "Email already exists" },
            { status: 409 }
         );
      }
      return NextResponse.json(
         { message: "An error occurred during signup" },
         { status: 500 }
      );
   }
}
