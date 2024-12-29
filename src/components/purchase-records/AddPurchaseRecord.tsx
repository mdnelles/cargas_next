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

interface AddPurchaseRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddPurchaseRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddPurchaseRecordProps) {
   const [formData, setFormData] = useState({
      purchase_date: "",
      purchase_price: "",
      seller_name: "",
      seller_contact: "",
      payment_method: "",
      warranty: "",
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
         const response = await fetch("/api/purchase-records", {
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
            const newPurchaseRecord = {
               id: responseData.id,
               user_id: userId,
               vehicle_id: vehicleId,
               ...formData,
            };

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!user["purchase_records"]) {
               user["purchase_records"] = [];
            }

            user["purchase_records"].push(newPurchaseRecord);
            localStorage.setItem("user", JSON.stringify(user));
            setRender(!render);
            onClose();
         } else {
            console.error("Failed to add purchase record");
         }
      } catch (error) {
         console.error("Error adding purchase record:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Purchase Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new purchase record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='purchase_date'>Purchase Date</Label>
                  <Input
                     id='purchase_date'
                     name='purchase_date'
                     type='date'
                     value={formData.purchase_date}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='purchase_price'>Purchase Price</Label>
                  <Input
                     id='purchase_price'
                     name='purchase_price'
                     type='number'
                     step='0.01'
                     value={formData.purchase_price}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='seller_name'>Seller Name</Label>
                  <Input
                     id='seller_name'
                     name='seller_name'
                     value={formData.seller_name}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='seller_contact'>Seller Contact</Label>
                  <Input
                     id='seller_contact'
                     name='seller_contact'
                     value={formData.seller_contact}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='payment_method'>Payment Method</Label>
                  <Select
                     name='payment_method'
                     value={formData.payment_method}
                     onValueChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           payment_method: value,
                        }))
                     }
                  >
                     <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select payment method' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='cash'>Cash</SelectItem>
                        <SelectItem value='card'>Card</SelectItem>
                        <SelectItem value='loan'>Loan</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor='warranty'>Warranty</Label>
                  <Input
                     id='warranty'
                     name='warranty'
                     value={formData.warranty}
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
                        Adding Purchase...
                     </>
                  ) : (
                     "Add Purchase Record"
                  )}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
