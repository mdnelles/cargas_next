import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket, OkPacket } from "mysql2";

interface FuelUp extends RowDataPacket {
   id: number;
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

export async function GET() {
   try {
      const [rows] = await pool.query<FuelUp[]>(
         "SELECT * FROM fuel_up_records"
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
