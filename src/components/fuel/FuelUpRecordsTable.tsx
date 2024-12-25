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
import { FuelUp } from "@/types/fuelUp";
import { AddFuelUpForm } from "./AddFuelDialog";

interface FuelUpRecordsTableProps {
   initialFuelUps: FuelUp[];
}

export function FuelUpRecordsTable({
   initialFuelUps,
}: FuelUpRecordsTableProps) {
   const [fuelUps, setFuelUps] = useState<FuelUp[]>(initialFuelUps);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [selectedFuelUp, setSelectedFuelUp] = useState<FuelUp | null>(null);

   // get the token from the user object in localStorage
   const user = JSON.parse(localStorage.getItem("user") || "{}");

   useEffect(() => {
      localStorage.setItem("fuelUps", JSON.stringify(fuelUps));
   }, [fuelUps]);

   const handleDelete = async (id: number) => {
      if (window.confirm("Are you sure you want to delete this record?")) {
         try {
            setIsLoading(true);
            const token = JSON.parse(
               localStorage.getItem("user") || "{}"
            ).token;
            const response = await fetch(`/api/fuel-ups?id=${id}`, {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            if (!response.ok) {
               throw new Error("Failed to delete fuel-up");
            }
            // check to make sure fuelUps is an array
            if (!Array.isArray(fuelUps)) {
               throw new Error("FuelUps is not an array");
            }
            setFuelUps(fuelUps.filter((fuelUp) => fuelUp.id !== id));
         } catch (err) {
            console.error("Error deleting fuel-up:", err);
            setError("Failed to delete the record. Please try again.");
         } finally {
            setIsLoading(false);
         }
      }
   };

   const handleAddFuelUp = (newFuelUp: FuelUp) => {
      setFuelUps([newFuelUp, ...fuelUps]);
   };

   if (error) {
      return <div className='text-red-500'>{error}</div>;
   }

   return (
      <>
         <AddFuelUpForm onAddFuelUp={handleAddFuelUp} />
         {isLoading ? (
            <LoadingSkeleton />
         ) : (
            <Table>
               <TableCaption>
                  A list of your recent fuel-up records.
               </TableCaption>
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
                  {!Array.isArray(fuelUps) ? (
                     <></>
                  ) : (
                     fuelUps.map((fuelUp: FuelUp, index: number) => (
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
                     ))
                  )}
               </TableBody>
            </Table>
         )}
         {selectedFuelUp && (
            <FuelUpDetailsDialog
               fuelUp={selectedFuelUp}
               open={!!selectedFuelUp}
               onClose={() => setSelectedFuelUp(null)}
            />
         )}
      </>
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
