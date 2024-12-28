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

interface ServiceRecord {
   id: number;
   date_of_service: string;
   covered_by_warranty: boolean;
   cost: number;
   service_type: string;
   [key: string]: any;
}

interface ServiceRecordsTableProps {
   vehicleId: number;
}

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
                        {record.covered_by_warranty ? "Yes" : "No"}
                     </TableCell>
                     <TableCell>${record.cost.toFixed(2)}</TableCell>
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
            <DialogContent className='max-w-[400px] max-h-[80vh] overflow-y-auto'>
               <DialogHeader>
                  <DialogTitle>Service Record Details</DialogTitle>
               </DialogHeader>
               <DialogDescription>
                  {selectedRecord && (
                     <div>
                        {Object.entries(selectedRecord).map(([key, value]) => (
                           <p key={key} className='mb-2'>
                              <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                              {value.toString()}
                           </p>
                        ))}
                     </div>
                  )}
               </DialogDescription>
            </DialogContent>
         </Dialog>
      </>
   );
}
