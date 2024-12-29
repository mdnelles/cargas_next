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
import { Loader2 } from "lucide-react";

interface AddAccidentRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddAccidentRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddAccidentRecordProps) {
   const [formData, setFormData] = useState({
      date_of_accident: "",
      location: "",
      description: "",
      damage_estimate: "",
      injury_reported: false,
      reported_to_insurance: false,
      insurance_claim_number: "",
      police_report_number: "",
      at_fault: false,
      photos: "",
      notes: "",
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const response = await fetch("/api/accident-records", {
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
            const newAccidentRecord = {
               id: responseData.id,
               user_id: userId,
               vehicle_id: vehicleId,
               ...formData,
            };

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!user["accident_records"]) {
               user["accident_records"] = [];
            }

            user["accident_records"].push(newAccidentRecord);
            localStorage.setItem("user", JSON.stringify(user));
            setRender(!render);
            onClose();
         } else {
            console.error("Failed to add accident record");
         }
      } catch (error) {
         console.error("Error adding accident record:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Accident Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new accident record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='date_of_accident'>Date of Accident</Label>
                  <Input
                     id='date_of_accident'
                     name='date_of_accident'
                     type='date'
                     value={formData.date_of_accident}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                     id='location'
                     name='location'
                     value={formData.location}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                     id='description'
                     name='description'
                     value={formData.description}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='damage_estimate'>Damage Estimate</Label>
                  <Input
                     id='damage_estimate'
                     name='damage_estimate'
                     type='number'
                     step='0.01'
                     value={formData.damage_estimate}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='injury_reported'>Injury Reported</Label>
                  <Input
                     id='injury_reported'
                     name='injury_reported'
                     type='checkbox'
                     checked={formData.injury_reported}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           injury_reported: e.target.checked,
                        }))
                     }
                  />
               </div>
               <div>
                  <Label htmlFor='reported_to_insurance'>
                     Reported to Insurance
                  </Label>
                  <Input
                     id='reported_to_insurance'
                     name='reported_to_insurance'
                     type='checkbox'
                     checked={formData.reported_to_insurance}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           reported_to_insurance: e.target.checked,
                        }))
                     }
                  />
               </div>
               <div>
                  <Label htmlFor='insurance_claim_number'>
                     Insurance Claim Number
                  </Label>
                  <Input
                     id='insurance_claim_number'
                     name='insurance_claim_number'
                     value={formData.insurance_claim_number}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='police_report_number'>
                     Police Report Number
                  </Label>
                  <Input
                     id='police_report_number'
                     name='police_report_number'
                     value={formData.police_report_number}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='at_fault'>At Fault</Label>
                  <Input
                     id='at_fault'
                     name='at_fault'
                     type='checkbox'
                     checked={formData.at_fault}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           at_fault: e.target.checked,
                        }))
                     }
                  />
               </div>
               <div>
                  <Label htmlFor='photos'>Photos (URLs, comma-separated)</Label>
                  <Input
                     id='photos'
                     name='photos'
                     value={formData.photos}
                     onChange={handleChange}
                  />
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
               <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Adding Accident...
                     </>
                  ) : (
                     "Add Accident Record"
                  )}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
