"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

interface AddTripRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddTripRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddTripRecordProps) {
   const [formData, setFormData] = useState({
      start_date: "",
      end_date: "",
      start_location: "",
      end_location: "",
      distance_traveled: "",
      fuel_consumed: "",
      cost: "",
      trip_type: "",
      notes: "",
   });

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const response = await fetch("/api/trip-records", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            ...formData,
            vehicle_id: vehicleId,
            user_id: userId,
         }),
      });

      if (response.ok) {
         const responseData = await response.json();
         const newTripRecord = {
            id: responseData.id,
            user_id: userId,
            vehicle_id: vehicleId,
            ...formData,
         };

         const user = JSON.parse(localStorage.getItem("user") || "{}");

         if (!user["trip_records"]) {
            user["trip_records"] = [];
         }

         user["trip_records"].push(newTripRecord);
         localStorage.setItem("user", JSON.stringify(user));
         setRender(!render);
         onClose();
      } else {
         console.error("Failed to add trip record");
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Trip Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new trip record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='start_date'>Start Date</Label>
                  <Input
                     id='start_date'
                     name='start_date'
                     type='datetime-local'
                     value={formData.start_date}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='end_date'>End Date</Label>
                  <Input
                     id='end_date'
                     name='end_date'
                     type='datetime-local'
                     value={formData.end_date}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='start_location'>Start Location</Label>
                  <Input
                     id='start_location'
                     name='start_location'
                     value={formData.start_location}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='end_location'>End Location</Label>
                  <Input
                     id='end_location'
                     name='end_location'
                     value={formData.end_location}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='distance_traveled'>Distance Traveled</Label>
                  <Input
                     id='distance_traveled'
                     name='distance_traveled'
                     type='number'
                     step='0.01'
                     value={formData.distance_traveled}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='fuel_consumed'>Fuel Consumed</Label>
                  <Input
                     id='fuel_consumed'
                     name='fuel_consumed'
                     type='number'
                     step='0.01'
                     value={formData.fuel_consumed}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='cost'>Cost</Label>
                  <Input
                     id='cost'
                     name='cost'
                     type='number'
                     step='0.01'
                     value={formData.cost}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='trip_type'>Trip Type</Label>
                  <Select
                     name='trip_type'
                     value={formData.trip_type}
                     onValueChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           trip_type: value,
                        }))
                     }
                  >
                     <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select trip type' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='Business'>Business</SelectItem>
                        <SelectItem value='Personal'>Personal</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor='notes'>Notes</Label>
                  <Textarea
                     id='notes'
                     name='notes'
                     value={formData.notes}
                     onChange={handleChange}
                  />
               </div>
               <Button type='submit'>Add Trip Record</Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
