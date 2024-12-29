import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket, OkPacket } from "mysql2";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const vehicleId = searchParams.get("vehicleId");

   if (!vehicleId) {
      return NextResponse.json(
         { error: "Vehicle ID is required" },
         { status: 400 }
      );
   }

   try {
      const [rows] = await pool.query<RowDataPacket[]>(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            start_date,
            end_date,
            start_location,
            end_location,
            distance_traveled,
            fuel_consumed,
            cost,
            notes,
            trip_type,
            created_at,
            updated_at
         FROM trip_records WHERE vehicle_id = ?`,
         [vehicleId]
      );
      return NextResponse.json(rows);
   } catch (error) {
      console.error("Error fetching trip records:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

export async function DELETE(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const id = searchParams.get("id");

   if (!id) {
      return NextResponse.json(
         { error: "Record ID is required" },
         { status: 400 }
      );
   }

   try {
      const [result] = await pool.query<OkPacket>(
         "DELETE FROM trip_records WHERE id = ?",
         [id]
      );
      if (result.affectedRows === 0) {
         return NextResponse.json(
            { error: "Record not found" },
            { status: 404 }
         );
      }
      return NextResponse.json({ message: "Record deleted successfully" });
   } catch (error) {
      console.error("Error deleting trip record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest) {
   const body = await request.json();

   try {
      const [result] = await pool.query<OkPacket>(
         `INSERT INTO trip_records (
            user_id,
            vehicle_id,
            start_date,
            end_date,
            start_location,
            end_location,
            distance_traveled,
            fuel_consumed,
            cost,
            notes,
            trip_type
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            body.user_id,
            body.vehicle_id,
            body.start_date,
            body.end_date,
            body.start_location,
            body.end_location,
            body.distance_traveled,
            body.fuel_consumed,
            body.cost,
            body.notes,
            body.trip_type,
         ]
      );
      return NextResponse.json({
         id: result.insertId,
         message: "Trip record added successfully",
      });
   } catch (error) {
      console.error("Error adding trip record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
