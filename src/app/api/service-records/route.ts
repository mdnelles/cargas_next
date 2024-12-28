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
         "SELECT * FROM service_records WHERE vehicle_id = ?",
         [vehicleId]
      );
      return NextResponse.json(rows);
   } catch (error) {
      console.error("Error fetching service records:", error);
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
         "DELETE FROM service_records WHERE id = ?",
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
      console.error("Error deleting service record:", error);
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
         `INSERT INTO service_records (
            user_id, vehicle_id, date_of_service, at_the_dealer, covered_by_warranty, cost,
            service_type, service_description, mileage_at_service, dealer_name,
            service_location, service_duration, next_service_due, next_service_mileage,
            parts_replaced, labor_cost, parts_cost, invoice_number, service_notes, serviced_by
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            body.user_id,
            body.vehicle_id,
            body.date_of_service,
            body.at_the_dealer,
            body.covered_by_warranty,
            body.cost,
            body.service_type,
            body.service_description,
            body.mileage_at_service,
            body.dealer_name,
            body.service_location,
            body.service_duration,
            body.next_service_due,
            body.next_service_mileage,
            body.parts_replaced,
            body.labor_cost,
            body.parts_cost,
            body.invoice_number,
            body.service_notes,
            body.serviced_by,
         ]
      );
      return NextResponse.json({
         id: result.insertId,
         message: "Service record added successfully",
      });
   } catch (error) {
      console.error("Error adding service record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
