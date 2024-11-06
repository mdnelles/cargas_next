import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { createToken } from "@/lib/jwt";

interface User extends RowDataPacket {
   id: number;
   email: string;
   password: string;
}

export async function POST(req: Request) {
   try {
      const { email, password } = await req.json();

      if (!email || !password) {
         return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
         );
      }

      const [rows] = await pool.query<User[]>(
         "SELECT * FROM users WHERE email = ?",
         [email]
      );

      const user = rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
         return NextResponse.json(
            { message: "Invalid email or password" },
            { status: 401 }
         );
      }

      const token = createToken({ userId: user.id, email: user.email });

      const response = NextResponse.json(
         { message: "Sign in successful" },
         { status: 200 }
      );
      response.cookies.set("auth_token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 86400, // 1 day
         path: "/",
      });

      return response;
   } catch (error) {
      console.error("Sign in error:", error);
      return NextResponse.json(
         { message: "An error occurred during sign in" },
         { status: 500 }
      );
   }
}
