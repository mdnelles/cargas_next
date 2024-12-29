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

interface SaleRecord {
   id: number;
   sale_date: string;
   sale_price: number;
   buyer_name: string;
   payment_method?: string;
   notes?: string;
   [key: string]: any;
}

interface SaleRecordsTableProps {
   vehicleId: number;
   render?: boolean;
   selectedVehicle: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key === "sale_date" || key.includes("date")) {
      return new Date(value).toLocaleDateString();
   }
   if (key === "sale_price" || key.includes("price")) {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
   }
   return value.toString();
};

export default function SaleRecordsTable({
   vehicleId,
   render,
   selectedVehicle,
}: SaleRecordsTableProps) {
   const [records, setRecords] = useState<SaleRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<SaleRecord | null>(
      null
   );

   const fetchRecords = () => {
      console.log("Fetching sale records");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (Array.isArray(user.sale_records)) {
         const vehicleRecords = user.sale_records.filter(
            (record: SaleRecord) => record.vehicle_id === vehicleId
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
         "Are you sure you want to delete this sale record?"
      );
      if (userConfirmed) {
         try {
            await fetch(`/api/sale-records?id=${id}`, { method: "DELETE" });
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.sale_records = user.sale_records.filter(
               (record: SaleRecord) => record.id !== id
            );
            localStorage.setItem("user", JSON.stringify(user));
            fetchRecords();
         } catch (error) {
            console.error("Error deleting sale record:", error);
            alert("An error occurred while deleting the sale record.");
         }
      }
   };

   const handleDetails = (record: SaleRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Buyer Name</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {formatValue("sale_date", record.sale_date)}
                     </TableCell>
                     <TableCell>
                        {formatValue("sale_price", record.sale_price)}
                     </TableCell>
                     <TableCell>{record.buyer_name}</TableCell>
                     <TableCell>{record.payment_method || "N/A"}</TableCell>
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
                  <DialogTitle>Sale Record Details</DialogTitle>
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
