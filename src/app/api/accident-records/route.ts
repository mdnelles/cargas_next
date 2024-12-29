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
         "SELECT * FROM accident_records WHERE vehicle_id = ?",
         [vehicleId]
      );
      return NextResponse.json(rows);
   } catch (error) {
      console.error("Error fetching accident records:", error);
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
         "DELETE FROM accident_records WHERE id = ?",
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
      console.error("Error deleting accident record:", error);
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
         `INSERT INTO accident_records (
            user_id, vehicle_id, date_of_accident, location, description, damage_estimate,
            injury_reported, reported_to_insurance, insurance_claim_number, 
            police_report_number, at_fault, photos, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            body.user_id,
            body.vehicle_id,
            body.date_of_accident,
            body.location,
            body.description,
            body.damage_estimate,
            body.injury_reported,
            body.reported_to_insurance,
            body.insurance_claim_number,
            body.police_report_number,
            body.at_fault,
            JSON.stringify(body.photos), // Serialize photos if provided
            body.notes,
         ]
      );
      return NextResponse.json({
         id: result.insertId,
         message: "Accident record added successfully",
      });
   } catch (error) {
      console.error("Error adding accident record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
