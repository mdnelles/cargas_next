"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface AddServiceRecordProps {
   vehicleId: number;
   userId: number | any;
   onClose: () => void;
}

export default function AddServiceRecord({
   vehicleId,
   userId,
   onClose,
}: AddServiceRecordProps) {
   const [formData, setFormData] = useState({
      date_of_service: "",
      at_the_dealer: false,
      covered_by_warranty: false,
      cost: "",
      service_type: "",
      service_description: "",
      mileage_at_service: "",
      dealer_name: "",
      service_location: "",
      service_duration: "",
      next_service_due: "",
      next_service_mileage: "",
      parts_replaced: "",
      labor_cost: "",
      parts_cost: "",
      invoice_number: "",
      service_notes: "",
      serviced_by: "",
   });

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleCheckboxChange = (name: string) => (checked: boolean) => {
      setFormData((prev) => ({ ...prev, [name]: checked }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const response = await fetch("/api/service-records", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            ...formData,
            vehicle_id: vehicleId,
            user_id: userId,
         }),
      });

      if (response.ok) {
         onClose();
      } else {
         console.error("Failed to add service record");
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[400px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Service Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new service record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='vehicle_id'>Vehicle ID (non-editable)</Label>
                  <Input id='vehicle_id' value={vehicleId} disabled />
               </div>
               <div>
                  <Label htmlFor='date_of_service'>Date of Service</Label>
                  <Input
                     id='date_of_service'
                     name='date_of_service'
                     type='date'
                     value={formData.date_of_service}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div className='flex items-center space-x-2'>
                  <Checkbox
                     id='at_the_dealer'
                     checked={formData.at_the_dealer}
                     onCheckedChange={handleCheckboxChange("at_the_dealer")}
                  />
                  <Label htmlFor='at_the_dealer'>At the Dealer</Label>
               </div>
               <div className='flex items-center space-x-2'>
                  <Checkbox
                     id='covered_by_warranty'
                     checked={formData.covered_by_warranty}
                     onCheckedChange={handleCheckboxChange(
                        "covered_by_warranty"
                     )}
                  />
                  <Label htmlFor='covered_by_warranty'>
                     Covered by Warranty
                  </Label>
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
                     required
                  />
               </div>
               <div>
                  <Select
                     name='service_type'
                     value={formData.service_type}
                     onValueChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           service_type: value,
                        }))
                     }
                  >
                     <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select service type' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='air_conditioning'>
                           Air Conditioning Service
                        </SelectItem>
                        <SelectItem value='battery_replacement'>
                           Battery Replacement
                        </SelectItem>
                        <SelectItem value='brake_service'>
                           Brake Service
                        </SelectItem>
                        <SelectItem value='engine_tune_up'>
                           Engine Tune-Up
                        </SelectItem>
                        <SelectItem value='exhaust_system'>
                           Exhaust System Repair
                        </SelectItem>
                        <SelectItem value='oil_change'>Oil Change</SelectItem>
                        <SelectItem value='radiator'>
                           Radiator Service
                        </SelectItem>
                        <SelectItem value='suspension'>
                           Suspension Repair
                        </SelectItem>
                        <SelectItem value='tire_rotation'>
                           Tire Rotation
                        </SelectItem>
                        <SelectItem value='transmission_service'>
                           Transmission Service
                        </SelectItem>
                        <SelectItem value='wheel_alignment'>
                           Wheel Alignment
                        </SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor='service_description'>
                     Service Description
                  </Label>
                  <Textarea
                     id='service_description'
                     name='service_description'
                     value={formData.service_description}
                     onChange={handleChange}
                  />
               </div>
               {/* Add more form fields for the remaining columns */}
               <Button type='submit'>Add Service Record</Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
