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

const excludedColumns = [
   "Time_to_charge_at_120V",
   "Time_to_charge_at_240V",
   "City_Mpg_For_Fuel_Type1",
   "Unrounded_City_Mpg_For_Fuel_Type1_2",
   "City_Mpg_For_Fuel_Type2",
   "Unrounded_City_Mpg_For_Fuel_Type2",
   "City_gasoline_consumption",
   "City_electricity_consumption",
   "EPA_city_utility_factor",
   "Co2_Fuel_Type1",
   "Co2_Fuel_Type2",
   "Co2_Tailpipe_For_Fuel_Type2",
   "Co2_Tailpipe_For_Fuel_Type1",
   "Annual_Fuel_Cost_For_Fuel_Type1",
   "Annual_Fuel_Cost_For_Fuel_Type2",
   "Unrounded_Highway_Mpg_For_Fuel_Type1",
   "Highway_Mpg_For_Fuel_Type2",
   "Unrounded_Highway_Mpg_For_Fuel_Type2",
   "Highway_gasoline_consumption",
   "Highway_electricity_consumption",
   "EPA_highway_utility_factor",
   "Hatchback_luggage_volume",
   "Hatchback_passenger_volume",
   "Unadjusted_City_Mpg_For_Fuel_Type1",
   "Unadjusted_City_Mpg_For_Fuel_Type2",
   "Unadjusted_Highway_Mpg_For_Fuel_Type1",
   "Unadjusted_Highway_Mpg_For_Fuel_Type2",
];

const truncateTitle = (title: string, maxLength: number = 10) => {
   return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
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
         {/* <div className='mb-4'>
        <h3 className="text-lg font-semibold mb-2">Toggle Columns:</h3>
        <div className='flex flex-wrap gap-2'>
          {allColumns.map((column) => (
            <label key={column} className='flex items-center space-x-2'>
              <Checkbox
                checked={visibleColumns.includes(column)}
                onCheckedChange={() => toggleColumn(column)}
                id={`checkbox-${column}`}
              />
              <span title={column}>{truncateTitle(column)}</span>
            </label>
          ))}
        </div>
      </div> */}
         <div className='overflow-x-auto'>
            <Table>
               <TableHeader>
                  <TableRow>
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
