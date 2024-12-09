// /app/dashboard/fuel-up-records/FuelClient.tsx

"use client";

import { FuelUpRecordsTable } from "@/components/fuel/FuelUpRecordsTable";
import DashboardTemplate from "../dashboard-template";
import { getFuelUps } from "@/lib/api";
import { useRef, useState } from "react";
import { FuelUp } from "@/types/fuelUp";

export default function FuelUpClient() {
   // get the token from the localStorage user object
   const [initialFuelUps, setInitialFuelUps] = useState<FuelUp[]>([]);
   const inital = useRef<boolean>(true);
   const token = JSON.parse(localStorage.getItem("user") || "{}").token;
   (async () => {
      if (inital.current === true) {
         setInitialFuelUps(await getFuelUps(token));
         inital.current = false;
      }
   })();

   return (
      <DashboardTemplate title='Fuel Up Records'>
         {inital.current ? (
            <p>Loading...</p>
         ) : (
            <FuelUpRecordsTable initialFuelUps={initialFuelUps} />
         )}
      </DashboardTemplate>
   );
}
