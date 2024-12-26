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

interface VehicleDataTableProps {
   data: any[]; // Update this to a more specific type if you know the structure of your vehicle data
}

const excludedColumns = ["ID"];

const truncateTitle = (title: string, maxLength: number = 20) => {
   // Replace underscores with spaces and convert to uppercase
   const formattedTitle = title.replace(/_/g, " ").toUpperCase();
   // Truncate the title if necessary
   return formattedTitle.length > maxLength
      ? formattedTitle.slice(0, maxLength) + "..."
      : formattedTitle;
};

export default function VehicleDataTable({ data }: VehicleDataTableProps) {
   const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
   const [allColumns, setAllColumns] = useState<string[]>([]);

   useEffect(() => {
      if (data.length > 0) {
         const columns = Object.keys(data[0]);
         setAllColumns(columns);
         setVisibleColumns(
            columns.filter((col) => !excludedColumns.includes(col))
         );
      }
   }, [data]);

   const toggleColumn = (column: string) => {
      setVisibleColumns((prev) =>
         prev.includes(column)
            ? prev.filter((col) => col !== column)
            : [...prev, column]
      );
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
                     <TableHead>Add</TableHead>
                     {visibleColumns.map((column) => (
                        <TableHead key={column} title={column}>
                           {truncateTitle(column)}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.map((vehicle, index) => (
                     <TableRow key={index}>
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
