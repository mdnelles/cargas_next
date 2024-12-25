"use client";

import React, { useState, useEffect } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Vehicle {
   ID: number;
   [key: string]: any;
}

interface UpdateUserVehiclesProps {
   data: Vehicle[];
   userId: number;
   initialUserVehicles: number[];
}

const excludedColumns = [
   "ID",
   "Time_to_charge_at_120V",
   "Time_to_charge_at_240V",
   // ... (rest of the excluded columns)
];

const truncateTitle = (title: string, maxLength: number = 20) => {
   const formattedTitle = title.replace(/_/g, " ").toUpperCase();
   return formattedTitle.length > maxLength
      ? formattedTitle.slice(0, maxLength) + "..."
      : formattedTitle;
};

export default function UpdateUserVehicles({
   data,
   userId,
   initialUserVehicles,
}: UpdateUserVehiclesProps) {
   const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
   const [allColumns, setAllColumns] = useState<string[]>([]);
   const [userVehicles, setUserVehicles] = useState<Set<number>>(
      new Set(initialUserVehicles)
   );

   useEffect(() => {
      if (data.length > 0) {
         const columns = Object.keys(data[0]);
         setAllColumns(columns);
         setVisibleColumns(
            columns.filter((col) => !excludedColumns.includes(col))
         );
      }
   }, [data]);

   const toggleVehicle = async (vehicleId: number) => {
      try {
         if (userVehicles.has(vehicleId)) {
            await fetch("/api/vehicle-user-link", {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ userId, vehicleId }),
            });
            setUserVehicles((prev) => {
               const newSet = new Set(prev);
               newSet.delete(vehicleId);
               return newSet;
            });
         } else {
            await fetch("/api/vehicle-user-link", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ userId, vehicleId }),
            });
            setUserVehicles((prev) => new Set(prev).add(vehicleId));
         }
      } catch (error) {
         console.error("Error toggling vehicle:", error);
      }
   };

   if (data.length === 0) {
      return <div>No data available</div>;
   }

   return (
      <div>
         <div className='overflow-x-auto'>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Select</TableHead>
                     {visibleColumns.map((column) => (
                        <TableHead key={column} title={column}>
                           {truncateTitle(column)}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.map((vehicle) => (
                     <TableRow key={vehicle.ID}>
                        <TableCell>
                           <Checkbox
                              checked={userVehicles.has(vehicle.ID)}
                              onCheckedChange={() => toggleVehicle(vehicle.ID)}
                           />
                        </TableCell>
                        {visibleColumns.map((column) => (
                           <TableCell key={column}>{vehicle[column]}</TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
