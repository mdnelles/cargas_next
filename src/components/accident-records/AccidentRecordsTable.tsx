"use client";

import { useState, useEffect, useCallback } from "react";
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

interface AccidentRecord {
   id: number;
   date_of_accident: string;
   location: string;
   description: string;
   damage_estimate: number;
   injury_reported: boolean;
   reported_to_insurance: boolean;
   insurance_claim_number?: string;
   police_report_number?: string;
   at_fault: boolean;
   photos?: string;
   notes?: string;
   [key: string]: any;
}

interface AccidentRecordsTableProps {
   vehicleId: number;
   render?: boolean;
   selectedVehicle: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key === "date_of_accident" || key.includes("date")) {
      return new Date(value).toLocaleDateString();
   }
   if (key === "damage_estimate") {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
   }
   if (typeof value === "boolean") {
      return value ? "Yes" : "No";
   }
   return value.toString();
};

export default function AccidentRecordsTable({
   vehicleId,
   render,
   selectedVehicle,
}: AccidentRecordsTableProps) {
   const [records, setRecords] = useState<AccidentRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<AccidentRecord | null>(
      null
   );

   const fetchRecords = () => {
      console.log("Fetching accident records");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (Array.isArray(user.accident_records)) {
         const vehicleRecords = user.accident_records.filter(
            (record: AccidentRecord) => record.vehicle_id === vehicleId
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
         "Are you sure you want to delete this accident record?"
      );
      if (userConfirmed) {
         try {
            await fetch(`/api/accident-records?id=${id}`, { method: "DELETE" });
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.accident_records = user.accident_records.filter(
               (record: AccidentRecord) => record.id !== id
            );
            localStorage.setItem("user", JSON.stringify(user));
            fetchRecords();
         } catch (error) {
            console.error("Error deleting accident record:", error);
            alert("An error occurred while deleting the accident record.");
         }
      }
   };

   const handleDetails = (record: AccidentRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Damage Estimate</TableHead>
                  <TableHead>At Fault</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {formatValue(
                           "date_of_accident",
                           record.date_of_accident
                        )}
                     </TableCell>
                     <TableCell>{record.location}</TableCell>
                     <TableCell>
                        {formatValue("damage_estimate", record.damage_estimate)}
                     </TableCell>
                     <TableCell>
                        {formatValue("at_fault", record.at_fault)}
                     </TableCell>
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
                  <DialogTitle>Accident Record Details</DialogTitle>
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
