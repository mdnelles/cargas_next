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
         "SELECT * FROM expense_records WHERE vehicle_id = ?",
         [vehicleId]
      );
      return NextResponse.json(rows);
   } catch (error) {
      console.error("Error fetching expense records:", error);
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
         "DELETE FROM expense_records WHERE id = ?",
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
      console.error("Error deleting expense record:", error);
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
         `INSERT INTO expense_records (
            user_id, vehicle_id, date_of_expense, expense_type, expense_description, cost,
            paid_to, receipt_number, payment_method, recurring, 
            recurring_interval, category, mileage_at_expense
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
            body.user_id,
            body.vehicle_id,
            body.date_of_expense,
            body.expense_type,
            body.expense_description,
            body.cost,
            body.paid_to,
            body.receipt_number,
            body.payment_method,
            body.recurring,
            body.recurring_interval,
            body.category,
            body.mileage_at_expense,
         ]
      );
      return NextResponse.json({
         id: result.insertId,
         message: "Expense record added successfully",
      });
   } catch (error) {
      console.error("Error adding expense record:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
