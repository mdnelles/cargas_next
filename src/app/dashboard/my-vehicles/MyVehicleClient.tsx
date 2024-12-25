"use client";

import DashboardTemplate from "../dashboard-template";
import { getUserVehicles } from "@/lib/api";
import { useRef, useState, useEffect } from "react";
import Loading from "@/components/loading";
import UpdateUserVehicles from "@/components/UpdateUserVehicles";

export default function FuelUpClient() {
   const [initialUserVehicles, setInitialUserVehicles] = useState<number[]>([]);
   const [loading, setLoading] = useState(true);
   const token = JSON.parse(localStorage.getItem("user") || "{}").token;

   useEffect(() => {
      const fetchUserVehicles = async () => {
         try {
            const userVehicles = await getUserVehicles(token);
            // Extract vehicle IDs
            const vehicleIds = userVehicles.map(
               (link: { vehicle_id: number }) => link.vehicle_id
            );
            setInitialUserVehicles(vehicleIds);
         } catch (error) {
            console.error("Error fetching user vehicles:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchUserVehicles();
   }, [token]);

   return (
      <DashboardTemplate title='Update User Vehicles'>
         {loading ? (
            <Loading />
         ) : (
            <UpdateUserVehicles
               data={[]}
               userId={0}
               initialUserVehicles={initialUserVehicles}
            />
         )}
      </DashboardTemplate>
   );
}
