"use client";

import { useState, useEffect } from "react";
import NoteRecordsTable from "@/components/note-records/NoteRecordsTable";
import AddNoteRecord from "@/components/note-records/AddNoteRecord";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import DashboardTemplate from "../dashboard-template";

interface Vehicle {
   id: number;
   name: string;
}

export default function ClientNoteRecords() {
   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
   const [selectedVehicle, setSelectedVehicle] = useState<number>(0);
   const [showAddDialog, setShowAddDialog] = useState(false);
   const [userId, setUserId] = useState<number>(0);
   const [render, setRender] = useState(false);

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserId(user.id);
      const userVehicles = user.vehicles || [];
      console.log(userVehicles);
      setVehicles(userVehicles);
   }, []);

   useEffect(() => {
      console.log("Selected vehicle:", selectedVehicle);
   }, [selectedVehicle]);

   return (
      <DashboardTemplate title='Note Records'>
         <div className='mb-4'>
            <Select
               onValueChange={(value) => setSelectedVehicle(Number(value))}
            >
               <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Select a vehicle' />
               </SelectTrigger>
               <SelectContent>
                  {vehicles.map((vehicle: any) => (
                     <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {selectedVehicle ? (
            <>
               <Button onClick={() => setShowAddDialog(true)} className='mb-4'>
                  Add New Note Record
               </Button>
               <NoteRecordsTable
                  vehicleId={selectedVehicle}
                  render={render}
                  selectedVehicle={selectedVehicle}
               />
            </>
         ) : (
            <></>
         )}

         {showAddDialog && (
            <AddNoteRecord
               vehicleId={selectedVehicle!}
               userId={userId}
               render={render}
               setRender={setRender}
               onClose={() => setShowAddDialog(false)}
            />
         )}
      </DashboardTemplate>
   );
}
