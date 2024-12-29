import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { createToken } from "@/lib/jwt";

interface User extends RowDataPacket {
   id: number;
   email: string;
   password: string;
   country: string;
   name: string;
}

export async function POST(req: Request) {
   try {
      const { email, password } = await req.json();

      if (!email || !password) {
         return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
         );
      }

      const [rows] = await pool.query<User[]>(
         "SELECT * FROM users WHERE email = ?",
         [email]
      );

      const user = rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
         return NextResponse.json(
            { message: "Invalid email or password" },
            { status: 401 }
         );
      }

      const token = createToken({
         userId: user.id,
         email: user.email,
         name: user.name,
         country: user.country,
      });

      // Fetch vehicles
      const [rows2]: any[] = await pool.query(
         "SELECT vehicle_id,year,make,model FROM vehicle_user_link WHERE user_id = ?",
         [user.id]
      );
      const vehicles = rows2.map((row: any) => ({
         id: row.vehicle_id,
         year: row.year,
         make: row.make,
         model: row.model,
      }));

      // Fetch service records
      const [rows3]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            date_of_service,
            at_the_dealer,
            covered_by_warranty,
            cost,
            service_type,
            service_description,
            mileage_at_service,
            dealer_name,
            service_location,
            service_duration,
            next_service_due,
            next_service_mileage,
            parts_replaced,
            labor_cost,
            parts_cost,
            invoice_number,
            service_notes,
            serviced_by,
            created_at,
            updated_at
         FROM service_records
         WHERE user_id = ?`,
         [user.id]
      );

      const service_records = rows3.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         date_of_service: row.date_of_service,
         at_the_dealer: !!row.at_the_dealer,
         covered_by_warranty: !!row.covered_by_warranty,
         cost: row.cost,
         service_type: row.service_type,
         service_description: row.service_description,
         mileage_at_service: row.mileage_at_service,
         dealer_name: row.dealer_name,
         service_location: row.service_location,
         service_duration: row.service_duration,
         next_service_due: row.next_service_due,
         next_service_mileage: row.next_service_mileage,
         parts_replaced: row.parts_replaced,
         labor_cost: row.labor_cost,
         parts_cost: row.parts_cost,
         invoice_number: row.invoice_number,
         service_notes: row.service_notes,
         serviced_by: row.serviced_by,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      // Fetch expense records
      const [rows4]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            date_of_expense,
            expense_type,
            expense_description,
            cost,
            paid_to,
            receipt_number,
            payment_method,
            mileage_at_expense,
            created_at,
            updated_at
         FROM expense_records
         WHERE user_id = ?`,
         [user.id]
      );

      const expense_records = rows4.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         date_of_expense: row.date_of_expense,
         expense_type: row.expense_type,
         expense_description: row.expense_description,
         cost: row.cost,
         paid_to: row.paid_to,
         receipt_number: row.receipt_number,
         payment_method: row.payment_method,
         mileage_at_expense: row.mileage_at_expense,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      // Fetch trip records
      const [rows5]: any[] = await pool.query(
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
         FROM trip_records
         WHERE user_id = ?`,
         [user.id]
      );

      const trip_records = rows5.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         start_date: row.start_date,
         end_date: row.end_date,
         start_location: row.start_location,
         end_location: row.end_location,
         distance_traveled: row.distance_traveled,
         fuel_consumed: row.fuel_consumed,
         cost: row.cost,
         notes: row.notes,
         trip_type: row.trip_type,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      // Fetch note records
      const [rows6]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            note_date,
            title,
            content,
            created_at,
            updated_at
         FROM note_records
         WHERE user_id = ?`,
         [user.id]
      );

      const note_records = rows6.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         note_date: row.note_date,
         title: row.title,
         content: row.content,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      // Fetch accident records
      const [rows7]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            date_of_accident,
            location,
            description,
            damage_estimate,
            injury_reported,
            reported_to_insurance,
            insurance_claim_number,
            police_report_number,
            at_fault,
            photos,
            notes,
            created_at,
            updated_at
         FROM accident_records
         WHERE user_id = ?`,
         [user.id]
      );

      const accident_records = rows7.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         date_of_accident: row.date_of_accident,
         location: row.location,
         description: row.description,
         damage_estimate: row.damage_estimate,
         injury_reported: !!row.injury_reported,
         reported_to_insurance: !!row.reported_to_insurance,
         insurance_claim_number: row.insurance_claim_number,
         police_report_number: row.police_report_number,
         at_fault: !!row.at_fault,
         photos: row.photos ? JSON.parse(row.photos) : [],
         notes: row.notes,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      // Fetch purchase records
      const [rows8]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            purchase_date,
            purchase_price,
            seller_name,
            seller_contact,
            payment_method,
            warranty,
            notes,
            created_at,
            updated_at
         FROM purchase_records
         WHERE user_id = ?`,
         [user.id]
      );

      const purchase_records = rows8.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         purchase_date: row.purchase_date,
         purchase_price: row.purchase_price,
         seller_name: row.seller_name,
         seller_contact: row.seller_contact,
         payment_method: row.payment_method,
         warranty: row.warranty,
         notes: row.notes,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      const [rows9]: any[] = await pool.query(
         `SELECT 
            id,
            user_id,
            vehicle_id,
            buyer_name,
            sale_date,
            sale_price,
            payment_method,
            notes,
            created_at,
            updated_at
         FROM sale_records
         WHERE user_id = ?`,
         [user.id]
      );

      const sale_records = rows9.map((row: any) => ({
         id: row.id,
         user_id: row.user_id,
         vehicle_id: row.vehicle_id,
         buyer_name: row.buyer_name,
         sale_date: row.sale_date,
         sale_price: row.sale_price,
         payment_method: row.payment_method,
         notes: row.notes,
         created_at: row.created_at,
         updated_at: row.updated_at,
      }));

      const response = NextResponse.json(
         {
            message: "Sign in successful",
            user: {
               id: user.id,
               email: user.email,
               name: user.name,
               country: user.country,
               token,
               vehicles,
               service_records,
               expense_records,
               trip_records,
               note_records,
               accident_records,
               purchase_records,
               sale_records,
            },
         },
         { status: 200 }
      );
      response.cookies.set("auth_token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 86400, // 1 day
         path: "/",
      });

      return response;
   } catch (error) {
      console.error("Sign in error:", error);
      return NextResponse.json(
         { message: "An error occurred during sign in" },
         { status: 500 }
      );
   }
}
