// src/lib/api.ts
import { FuelUp } from "@/types/fuelUp";

export async function getFuelUps(token: string): Promise<FuelUp[]> {
   // pass in the token to the fetch request
   const response = await fetch("/api/fuel-ups", {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });
   if (!response.ok) {
      throw new Error("Failed to fetch fuel-ups");
   }
   const data = await response.json();
   return data.sort(
      (a: FuelUp, b: FuelUp) =>
         new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
   );
}

export async function getUserVehicles(token: string): Promise<any[]> {
   // pass in the token to the fetch request
   const response = await fetch("/api/user-vehicles", {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });
   if (!response.ok) {
      throw new Error("Failed to fetch user vehicles");
   }
   const data = await response.json();
   return data;
}
