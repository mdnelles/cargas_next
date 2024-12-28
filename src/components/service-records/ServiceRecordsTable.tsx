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
import { CheckCircle2, XCircle } from "lucide-react";

interface ServiceRecord {
   id: number;
   date_of_service: string;
   covered_by_warranty: boolean;
   at_the_dealer: boolean;
   cost: number;
   service_type: string;
   [key: string]: any;
}

interface ServiceRecordsTableProps {
   vehicleId: number;
}

const formatValue = (key: string, value: any): React.ReactNode => {
   if (value === null || value === undefined) return "N/A";
   if (key === "date_of_service" || key.includes("date")) {
      return new Date(value).toLocaleDateString();
   }
   if (key === "cost" || key.includes("cost")) {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
   }
   if (key === "covered_by_warranty" || key === "at_the_dealer") {
      return value === "1" || value === true ? (
         <CheckCircle2 className='text-green-500' />
      ) : (
         <XCircle className='text-red-500' />
      );
   }
   return value.toString();
};

export default function ServiceRecordsTable({
   vehicleId,
}: ServiceRecordsTableProps) {
   const [records, setRecords] = useState<ServiceRecord[]>([]);
   const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(
      null
   );

   useEffect(() => {
      fetchRecords();
   }, [vehicleId]);

   const fetchRecords = async () => {
      const response = await fetch(
         `/api/service-records?vehicleId=${vehicleId}`
      );
      const data = await response.json();
      setRecords(data);
   };

   const handleDelete = async (id: number) => {
      await fetch(`/api/service-records?id=${id}`, { method: "DELETE" });
      fetchRecords();
   };

   const handleDetails = (record: ServiceRecord) => {
      setSelectedRecord(record);
   };

   return (
      <>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>At Dealer</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {records.map((record) => (
                  <TableRow key={record.id}>
                     <TableCell>
                        {new Date(record.date_of_service).toLocaleDateString()}
                     </TableCell>
                     <TableCell>
                        {formatValue(
                           "covered_by_warranty",
                           record.covered_by_warranty
                        )}
                     </TableCell>
                     <TableCell>
                        {formatValue("at_the_dealer", record.at_the_dealer)}
                     </TableCell>
                     <TableCell>
                        {record.cost
                           ? `$${Number(record.cost).toFixed(2)}`
                           : "$0.00"}
                     </TableCell>
                     <TableCell>{record.service_type}</TableCell>
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
                  <DialogTitle>Service Record Details</DialogTitle>
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
