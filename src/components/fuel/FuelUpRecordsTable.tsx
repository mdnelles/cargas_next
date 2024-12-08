"use client";

import { useState, useEffect } from "react";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { parseNumber } from "@/lib/utils";
import { FuelUpDetailsDialog } from "./FuelUpDetailsDialog";
import DashboardTemplate from "@/app/dashboard/dashboard-template";

interface FuelUp {
   id: number;
   odometer: number;
   previousOdometer: number | null;
   price: number;
   volume: number;
   totalCost: number;
   isPartialFuelUp: boolean;
   isMissedFuelUp: boolean;
   vehicleId: number;
   dateTime: string;
   paymentType: string | null;
   kilometersAdded: number | null;
}

export function FuelUpRecordsTable() {
   const [fuelUps, setFuelUps] = useState<FuelUp[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedFuelUp, setSelectedFuelUp] = useState<FuelUp | null>(null);

   useEffect(() => {
      const fetchFuelUps = async () => {
         try {
            const response = await fetch("/api/fuel-ups");
            if (!response.ok) {
               throw new Error("Failed to fetch fuel-ups");
            }
            const data = await response.json();
            // Sort the data by date, newest to oldest
            const sortedData = data.sort(
               (a: FuelUp, b: FuelUp) =>
                  new Date(b.dateTime).getTime() -
                  new Date(a.dateTime).getTime()
            );
            setFuelUps(sortedData);
            // now add to local storage
            localStorage.setItem("fuelUps", JSON.stringify(sortedData));
            setIsLoading(false);
         } catch (err) {
            setError("Failed to load fuel-up records");
            setIsLoading(false);
         }
      };

      fetchFuelUps();
   }, []);

   const handleDelete = async (id: number) => {
      if (window.confirm("Are you sure you want to delete this record?")) {
         try {
            const response = await fetch(`/api/fuel-ups/${id}`, {
               method: "DELETE",
            });
            if (!response.ok) {
               throw new Error("Failed to delete fuel-up");
            }
            setFuelUps(fuelUps.filter((fuelUp) => fuelUp.id !== id));
         } catch (err) {
            console.error("Error deleting fuel-up:", err);
            alert("Failed to delete the record. Please try again.");
         }
      }
   };

   if (isLoading) {
      return <LoadingSkeleton />;
   }

   if (error) {
      return <div className='text-red-500'>{error}</div>;
   }

   return (
      <DashboardTemplate title='Fuel Up Records'>
         <Table>
            <TableCaption>A list of your recent fuel-up records.</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Partial</TableHead>
                  <TableHead>Missed</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {fuelUps.map((fuelUp: FuelUp, index: number) => (
                  <TableRow key={fuelUp.id}>
                     <TableCell>{index + 1}</TableCell>
                     <TableCell>
                        {new Date(fuelUp.dateTime).toLocaleDateString()}
                     </TableCell>
                     <TableCell>
                        {parseNumber(fuelUp.odometer).toFixed(1)}
                     </TableCell>
                     <TableCell>
                        {parseNumber(fuelUp.volume).toFixed(2)}
                     </TableCell>
                     <TableCell>
                        ${parseNumber(fuelUp.price).toFixed(2)}
                     </TableCell>
                     <TableCell>
                        ${parseNumber(fuelUp.totalCost).toFixed(2)}
                     </TableCell>
                     <TableCell>
                        {fuelUp.isPartialFuelUp ? "Yes" : "No"}
                     </TableCell>
                     <TableCell>
                        {fuelUp.isMissedFuelUp ? "Yes" : "No"}
                     </TableCell>
                     <TableCell>
                        <Button
                           variant='outline'
                           size='sm'
                           className='mr-2'
                           onClick={() => setSelectedFuelUp(fuelUp)}
                        >
                           Details
                        </Button>
                        <Button
                           variant='destructive'
                           size='sm'
                           onClick={() => handleDelete(fuelUp.id)}
                        >
                           Delete
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         {selectedFuelUp && (
            <FuelUpDetailsDialog
               fuelUp={selectedFuelUp}
               open={!!selectedFuelUp}
               onClose={() => setSelectedFuelUp(null)}
            />
         )}
      </DashboardTemplate>
   );
}

function LoadingSkeleton() {
   return (
      <div className='space-y-2'>
         <Skeleton className='h-4 w-[250px]' />
         <Skeleton className='h-4 w-[200px]' />
         <Skeleton className='h-4 w-[300px]' />
         <Skeleton className='h-4 w-[250px]' />
         <Skeleton className='h-4 w-[200px]' />
      </div>
   );
}
