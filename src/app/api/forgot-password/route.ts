import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
   try {
      const { email } = await request.json();

      // Check if the user exists
      const [users] = await pool.query<RowDataPacket[]>(
         "SELECT * FROM users WHERE email = ?",
         [email]
      );
      if (users.length === 0) {
         return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
         );
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

      // Save the reset token and expiry to the user record
      await pool.query(
         "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
         [resetToken, resetTokenExpiry, email]
      );

      // Send reset email
      const transporter = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: Number(process.env.EMAIL_PORT),
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

      await transporter.sendMail({
         from: `"CarGas App" <${process.env.EMAIL_FROM}>`,
         to: email,
         subject: "Password Reset for CarGas",
         html: `
             <div style="text-align: center;">
                 <img src="https://cargas.io/_next/image?url=%2Fassets%2Fimg%2FlogoLarge.png&w=256&q=75" alt="CarGas Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
             </div>
             <p>You requested a password reset for your CarGas account.</p>
             <p>Click the link below to reset your password:</p>
             <a href="https://cargas.io/reset-password?token=${resetToken}">Reset Password</a>
             <p>This link will expire in 1 hour.</p>
             <p>If you didn't request this, please ignore this email.</p>
         `,
      });

      return NextResponse.json(
         { message: "Password reset email sent" },
         { status: 200 }
      );
   } catch (error) {
      console.error("Password reset error:", error);
      return NextResponse.json(
         { message: "An error occurred" },
         { status: 500 }
      );
   }
}
