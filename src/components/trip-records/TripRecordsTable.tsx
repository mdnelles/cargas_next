"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

interface TripRecord {
   id: number;
   start_date: string;
   end_date?: string;
   start_location: string;
   end_location?: string;
   distance_traveled?: number;
   fuel_consumed?: number;
   cost?: number;
   trip_type: string;
   notes?: string;
   [key: string]: any;
}

interface TripRecordsTableProps {
   vehicleId: number;
   render?: boolean;
   selectedVehicle: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key.includes("date")) {
      return new Date(value).toLocaleString();
   }
   if (
      key.includes("cost") ||
      key.includes("distance") ||
      key.includes("fuel")
   ) {
      return value ? `${Number(value).toFixed(2)}` : "0.00";
   }
   return value.toString();
};

export default function TripRecordsTable({
   vehicleId,
   render,
   selectedVehicle,
}: TripRecordsTableProps) {
   const [records, setRecords] = useState<TripRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<TripRecord | null>(
      null
   );

   const fetchRecords = () => {
      console.log("Fetching records");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (Array.isArray(user.trip_records)) {
         const vehicleRecords = user.trip_records.filter(
            (record: TripRecord) => record.vehicle_id === vehicleId
         );
         setRecords(vehicleRecords);
      }
   };

   useEffect(() => {
      fetchRecords();
   }, []);

   useEffect(() => {
      console.log("Render triggered:", render);
      fetchRecords();
   }, [render, selectedVehicle]);

   const handleDelete = async (id: number) => {
      const userConfirmed = window.confirm(
         "Are you sure you want to delete this trip record?"
      );
      if (userConfirmed) {
         try {
            await fetch(`/api/trip-records?id=${id}`, { method: "DELETE" });
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.trip_records = user.trip_records.filter(
               (record: TripRecord) => record.id !== id
            );
            localStorage.setItem("user", JSON.stringify(user));
            fetchRecords();
         } catch (error) {
            console.error("Error deleting trip record:", error);
            alert("An error occurred while deleting the trip record.");
         }
      }
   };

   const handleDetails = (record: TripRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Start Location</TableHead>
                  <TableHead>End Location</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Fuel Consumed</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Trip Type</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {formatValue("start_date", record.start_date)}
                     </TableCell>
                     <TableCell>
                        {formatValue("end_date", record.end_date)}
                     </TableCell>
                     <TableCell>{record.start_location}</TableCell>
                     <TableCell>{record.end_location || "N/A"}</TableCell>
                     <TableCell>
                        {formatValue(
                           "distance_traveled",
                           record.distance_traveled
                        )}
                     </TableCell>
                     <TableCell>
                        {formatValue("fuel_consumed", record.fuel_consumed)}
                     </TableCell>
                     <TableCell>{formatValue("cost", record.cost)}</TableCell>
                     <TableCell>{record.trip_type}</TableCell>
                     <TableCell>
                        <Button
                           variant='outline'
                           size='sm'
                           onClick={() => handleDetails(record)}
                           className='mr-2'
                        >
                           Details
                        </Button>
                        <Button
                           variant='destructive'
                           size='sm'
                           onClick={() => handleDelete(record.id)}
                        >
                           Delete
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>

         <Dialog
            open={!!selectedRecord}
            onOpenChange={() => setSelectedRecord(null)}
         >
            <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
               <DialogHeader>
                  <DialogTitle>Trip Record Details</DialogTitle>
               </DialogHeader>
               <DialogDescription asChild>
                  {selectedRecord && (
                     <div className='space-y-2'>
                        {Object.entries(selectedRecord)
                           .filter(
                              ([key]) =>
                                 !["id", "vehicle_id", "user_id"].includes(key)
                           )
                           .map(([key, value]) => (
                              <div
                                 key={key}
                                 className='flex justify-between items-center'
                              >
                                 <dt className='text-sm font-medium text-gray-500 capitalize text-right w-1/2 pr-4'>
                                    {key.replace(/_/g, " ")}:
                                 </dt>
                                 <dd className='text-sm text-gray-900 w-1/2'>
                                    {formatValue(key, value)}
                                 </dd>
                              </div>
                           ))}
                     </div>
                  )}
               </DialogDescription>
            </DialogContent>
         </Dialog>
      </>
   );
}
