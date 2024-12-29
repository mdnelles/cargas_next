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

interface ExpenseRecord {
   id: number;
   date_of_expense: string;
   cost: number;
   expense_type: string;
   paid_to?: string;
   receipt_number?: string;
   payment_method?: string;
   mileage_at_expense?: number;
   [key: string]: any;
}

interface ExpenseRecordsTableProps {
   vehicleId: number;
   render?: boolean;
   selectedVehicle: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key === "date_of_expense" || key.includes("date")) {
      return new Date(value).toLocaleDateString();
   }
   if (key === "cost" || key.includes("cost")) {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
   }
   return value.toString();
};

export default function ExpenseRecordsTable({
   vehicleId,
   render,
   selectedVehicle,
}: ExpenseRecordsTableProps) {
   const [records, setRecords] = useState<ExpenseRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<ExpenseRecord | null>(
      null
   );

   const fetchRecords = () => {
      console.log("Fetching records");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (Array.isArray(user.expense_records)) {
         const vehicleRecords = user.expense_records.filter(
            (record: ExpenseRecord) => record.vehicle_id === vehicleId
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
         "Are you sure you want to delete this expense record?"
      );
      if (userConfirmed) {
         try {
            await fetch(`/api/expense-records?id=${id}`, { method: "DELETE" });
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.expense_records = user.expense_records.filter(
               (record: ExpenseRecord) => record.id !== id
            );
            localStorage.setItem("user", JSON.stringify(user));
            fetchRecords();
         } catch (error) {
            console.error("Error deleting expense record:", error);
            alert("An error occurred while deleting the expense record.");
         }
      }
   };

   const handleDetails = (record: ExpenseRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Expense Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Expense Type</TableHead>
                  <TableHead>Paid To</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {formatValue("date_of_expense", record.date_of_expense)}
                     </TableCell>
                     <TableCell>{formatValue("cost", record.cost)}</TableCell>
                     <TableCell>{record.expense_type}</TableCell>
                     <TableCell>{record.paid_to || "N/A"}</TableCell>
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
                  <DialogTitle>Expense Record Details</DialogTitle>
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
