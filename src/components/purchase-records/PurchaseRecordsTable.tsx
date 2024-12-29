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

interface PurchaseRecord {
   id: number;
   purchase_date: string;
   purchase_price: number;
   seller_name: string;
   seller_contact?: string;
   payment_method?: string;
   warranty?: string;
   notes?: string;
   [key: string]: any;
}

interface PurchaseRecordsTableProps {
   vehicleId: number;
   render?: boolean;
   selectedVehicle: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key === "purchase_date" || key.includes("date")) {
      return new Date(value).toLocaleDateString();
   }
   if (key === "purchase_price" || key.includes("price")) {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
   }
   return value.toString();
};

export default function PurchaseRecordsTable({
   vehicleId,
   render,
   selectedVehicle,
}: PurchaseRecordsTableProps) {
   const [records, setRecords] = useState<PurchaseRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<PurchaseRecord | null>(
      null
   );

   const fetchRecords = () => {
      console.log("Fetching purchase records");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (Array.isArray(user.purchase_records)) {
         const vehicleRecords = user.purchase_records.filter(
            (record: PurchaseRecord) => record.vehicle_id === vehicleId
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
         "Are you sure you want to delete this purchase record?"
      );
      if (userConfirmed) {
         try {
            await fetch(`/api/purchase-records?id=${id}`, { method: "DELETE" });
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.purchase_records = user.purchase_records.filter(
               (record: PurchaseRecord) => record.id !== id
            );
            localStorage.setItem("user", JSON.stringify(user));
            fetchRecords();
         } catch (error) {
            console.error("Error deleting purchase record:", error);
            alert("An error occurred while deleting the purchase record.");
         }
      }
   };

   const handleDetails = (record: PurchaseRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Seller Name</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {formatValue("purchase_date", record.purchase_date)}
                     </TableCell>
                     <TableCell>
                        {formatValue("purchase_price", record.purchase_price)}
                     </TableCell>
                     <TableCell>{record.seller_name}</TableCell>
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
                  <DialogTitle>Purchase Record Details</DialogTitle>
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
