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

interface AddSaleRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddSaleRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddSaleRecordProps) {
   const [formData, setFormData] = useState({
      sale_date: "",
      sale_price: "",
      buyer_name: "",
      buyer_contact: "",
      payment_method: "",
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
         const response = await fetch("/api/sale-records", {
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
            const newSaleRecord = {
               id: responseData.id,
               user_id: userId,
               vehicle_id: vehicleId,
               ...formData,
            };

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!user["sale_records"]) {
               user["sale_records"] = [];
            }

            user["sale_records"].push(newSaleRecord);
            localStorage.setItem("user", JSON.stringify(user));
            setRender(!render);
            onClose();
         } else {
            console.error("Failed to add sale record");
         }
      } catch (error) {
         console.error("Error adding sale record:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Sale Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new sale record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='sale_date'>Sale Date</Label>
                  <Input
                     id='sale_date'
                     name='sale_date'
                     type='date'
                     value={formData.sale_date}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='sale_price'>Sale Price</Label>
                  <Input
                     id='sale_price'
                     name='sale_price'
                     type='number'
                     step='0.01'
                     value={formData.sale_price}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='buyer_name'>Buyer Name</Label>
                  <Input
                     id='buyer_name'
                     name='buyer_name'
                     value={formData.buyer_name}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='buyer_contact'>Buyer Contact</Label>
                  <Input
                     id='buyer_contact'
                     name='buyer_contact'
                     value={formData.buyer_contact}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='payment_method'>Payment Method</Label>
                  <Input
                     id='payment_method'
                     name='payment_method'
                     value={formData.payment_method}
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
                        Adding Sale Record...
                     </>
                  ) : (
                     "Add Sale Record"
                  )}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
