import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// Utility to verify the Authorization header and extract the token

// POST handler: Add a vehicle to the user's vehicles
export async function POST(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token");

      if (!token) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const { user_id, vehicle_id } = body;

      if (!user_id || !vehicle_id) {
         return NextResponse.json(
            { error: "Missing parameters" },
            { status: 400 }
         );
      }

      const query =
         "INSERT INTO vehicle_user_link (user_id, vehicle_id) VALUES (?, ?)";
      await pool.query(query, [user_id, vehicle_id]);

      return NextResponse.json({ message: "Vehicle added successfully" });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

// DELETE handler: Remove a vehicle from the user's vehicles
export async function DELETE(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token");
      if (!token) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const { user_id, vehicle_id } = body;

      if (!user_id || !vehicle_id) {
         return NextResponse.json(
            { error: "Missing parameters" },
            { status: 400 }
         );
      }

      const query =
         "DELETE FROM vehicle_user_link WHERE user_id = ? AND vehicle_id = ?";
      await pool.query(query, [user_id, vehicle_id]);

      return NextResponse.json({ message: "Vehicle removed successfully" });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
