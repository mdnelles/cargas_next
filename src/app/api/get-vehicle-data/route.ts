import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const make = searchParams.get("make");
   const model = searchParams.get("model");

   console.log("API Request - Make:", make, "Model:", model);

   try {
      let query: string;
      let params: any[];

      if (make && !model) {
         // If only make is provided, return distinct models for that make
         query =
            "SELECT DISTINCT Model FROM VehicleData WHERE Make = ? ORDER BY Model ASC";
         params = [make];
      } else if (make && model) {
         // If both make and model are provided, return all data for that specific vehicle
         query =
            "SELECT ID, Year, Make, Model, Transmission, Drive,Engine_descriptor,Fuel_type,Vehicle_size_class FROM VehicleData WHERE Make = ? AND Model = ? ORDER BY year DESC ";
         params = [make, model];
      } else {
         // If no parameters are provided, return distinct makes
         query = "SELECT DISTINCT Make FROM VehicleData ORDER BY Make ASC";
         params = [];
      }

      console.log("Executing query:", query, "with params:", params);

      const [rows] = await pool.query(query, params);
      console.log("Query result:", rows);

      if (make && !model) {
         return NextResponse.json((rows as any[]).map((row) => row.Model));
      } else if (!make && !model) {
         return NextResponse.json((rows as any[]).map((row) => row.Make));
      } else {
         return NextResponse.json(rows);
      }
   } catch (error) {
      console.error("Error fetching vehicle data:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}
