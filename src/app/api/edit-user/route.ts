import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const id = searchParams.get("id");

   if (!id) {
      return NextResponse.json(
         { error: "User ID is required" },
         { status: 400 }
      );
   }

   try {
      const [rows] = await pool.query<RowDataPacket[]>(
         "SELECT id, name, email, country FROM users WHERE id = ?",
         [id]
      );

      if (rows.length > 0) {
         return NextResponse.json(rows[0]);
      } else {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
   } catch (error) {
      console.error("Error fetching user info:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

export async function PUT(request: Request) {
   try {
      const { name, email, country, id } = await request.json();

      if (!id) {
         return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
         );
      }

      const [result] = await pool.query<ResultSetHeader>(
         "UPDATE users SET name = ?, email = ?, country = ? WHERE id = ?",
         [name, email, country, id]
      );

      if (result.affectedRows > 0) {
         return NextResponse.json({ message: "Profile updated successfully" });
      } else {
         return NextResponse.json(
            { error: "User not found or no changes made" },
            { status: 404 }
         );
      }
   } catch (error) {
      console.error("Error updating user info:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
