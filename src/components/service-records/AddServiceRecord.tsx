"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
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
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddServiceRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddServiceRecordProps) {
   const [isLongForm, setIsLongForm] = useState(false);
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
      const dataToSubmit = isLongForm
         ? formData
         : {
              date_of_service: formData.date_of_service,
              at_the_dealer: formData.at_the_dealer,
              covered_by_warranty: formData.covered_by_warranty,
              cost: formData.cost,
              service_type: formData.service_type,
              service_description: formData.service_description,
           };

      const response = await fetch("/api/service-records", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            ...dataToSubmit,
            vehicle_id: vehicleId,
            user_id: userId,
         }),
      });

      if (response.ok) {
         const responseData = await response.json(); // Extract the JSON response
         const newServiceRecord = {
            id: responseData.id,
            user_id: userId,
            vehicle_id: vehicleId,
            ...dataToSubmit,
         };

         const user = JSON.parse(localStorage.getItem("user") || "{}");

         if (!user["service_records"]) {
            user["service_records"] = [];
         }

         user["service_records"].push(newServiceRecord);
         localStorage.setItem("user", JSON.stringify(user));
         setRender(!render);
         onClose();
      } else {
         console.error("Failed to add service record");
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Service Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new service record for your
               vehicle.
            </DialogDescription>
            <div className='flex items-center space-x-2 mb-4'>
               <Switch
                  id='long-form-toggle'
                  checked={isLongForm}
                  onCheckedChange={setIsLongForm}
               />
               <Label htmlFor='long-form-toggle'>
                  {isLongForm ? "Long Form" : "Short Form"}
               </Label>
            </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <input type='hidden' name='vehicle_id' value={vehicleId} />
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
                  <Label htmlFor='service_type'>Service Type</Label>
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
               {isLongForm && (
                  <>
                     <div>
                        <Label htmlFor='mileage_at_service'>
                           Mileage at Service
                        </Label>
                        <Input
                           id='mileage_at_service'
                           name='mileage_at_service'
                           type='number'
                           value={formData.mileage_at_service}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='dealer_name'>Dealer Name</Label>
                        <Input
                           id='dealer_name'
                           name='dealer_name'
                           value={formData.dealer_name}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='service_location'>
                           Service Location
                        </Label>
                        <Input
                           id='service_location'
                           name='service_location'
                           value={formData.service_location}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='service_duration'>
                           Service Duration (hours)
                        </Label>
                        <Input
                           id='service_duration'
                           name='service_duration'
                           type='number'
                           value={formData.service_duration}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='next_service_due'>
                           Next Service Due Date
                        </Label>
                        <Input
                           id='next_service_due'
                           name='next_service_due'
                           type='date'
                           value={formData.next_service_due}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='next_service_mileage'>
                           Next Service Mileage
                        </Label>
                        <Input
                           id='next_service_mileage'
                           name='next_service_mileage'
                           type='number'
                           value={formData.next_service_mileage}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='parts_replaced'>Parts Replaced</Label>
                        <Textarea
                           id='parts_replaced'
                           name='parts_replaced'
                           value={formData.parts_replaced}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='labor_cost'>Labor Cost</Label>
                        <Input
                           id='labor_cost'
                           name='labor_cost'
                           type='number'
                           step='0.01'
                           value={formData.labor_cost}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='parts_cost'>Parts Cost</Label>
                        <Input
                           id='parts_cost'
                           name='parts_cost'
                           type='number'
                           step='0.01'
                           value={formData.parts_cost}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='invoice_number'>Invoice Number</Label>
                        <Input
                           id='invoice_number'
                           name='invoice_number'
                           value={formData.invoice_number}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='service_notes'>Service Notes</Label>
                        <Textarea
                           id='service_notes'
                           name='service_notes'
                           value={formData.service_notes}
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <Label htmlFor='serviced_by'>Serviced By</Label>
                        <Input
                           id='serviced_by'
                           name='serviced_by'
                           value={formData.serviced_by}
                           onChange={handleChange}
                        />
                     </div>
                  </>
               )}
               <Button type='submit'>Add Service Record</Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
