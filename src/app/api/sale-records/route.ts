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
         "SELECT * FROM sale_records WHERE vehicle_id = ?",
         [vehicleId]
      );
      return NextResponse.json(rows);
   } catch (error) {
      console.error("Error fetching sale records:", error);
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
         "DELETE FROM sale_records WHERE id = ?",
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
      console.error("Error deleting sale record:", error);
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
         `INSERT INTO sale_records (
            user_id, vehicle_id, buyer_name, sale_date, sale_price, payment_method, notes
         ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [
            body.user_id,
            body.vehicle_id,
            body.buyer_name,
            body.sale_date,
            body.sale_price,
            body.payment_method,
            body.notes,
         ]
      );
      return NextResponse.json({
         id: result.insertId,
         message: "Sale record added successfully",
      });
   } catch (error) {
      console.error("Error adding sale record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
