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
         at_the_dealer: !!row.at_the_dealer, // Convert tinyint to boolean
         covered_by_warranty: !!row.covered_by_warranty, // Convert tinyint to boolean
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
