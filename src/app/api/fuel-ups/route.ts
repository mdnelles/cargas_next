// src/app/api/fuel-ups/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket, OkPacket } from "mysql2";
import { verifyToken } from "@/lib/jwt";

interface FuelUp extends RowDataPacket {
   id: number;
   user_id: number;
   odometer: number;
   price: number;
   volume: number;
   totalCost: number;
   isPartialFuelUp: boolean;
   isMissedFuelUp: boolean;
   vehicleId: number;
   dateTime: string;
   // Add any other fields that are in your fuel_up_records table
}

export async function GET(req: Request) {
   try {
      // Get the Authorization header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return NextResponse.json(
            { error: "Authorization header missing or invalid" },
            { status: 401 }
         );
      }

      // Extract the token
      const token = authHeader.split(" ")[1];

      // Verify and decode the token
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded !== "object" || !decoded.userId) {
         return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
         );
      }

      const userId = decoded.userId;

      // Fetch records for the user
      const [rows] = await pool.query<FuelUp[]>(
         "SELECT * FROM fuel_up_records WHERE user_id = ?",
         [userId]
      );

      return NextResponse.json(rows);
   } catch (error) {
      console.error("Failed to fetch fuel-ups:", error);
      return NextResponse.json(
         { error: "Failed to fetch fuel-ups" },
         { status: 500 }
      );
   }
}

export async function POST(request: Request) {
   try {
      const body = await request.json();
      const [result] = await pool.query<any>(
         "INSERT INTO fuel_up_records SET ?",
         [body]
      );
      return NextResponse.json(
         { id: result.insertId, ...body },
         { status: 201 }
      );
   } catch (error) {
      console.error("Failed to create fuel-up:", error);
      return NextResponse.json(
         { error: "Failed to create fuel-up" },
         { status: 500 }
      );
   }
}
