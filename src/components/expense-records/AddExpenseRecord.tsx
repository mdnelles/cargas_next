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

interface AddExpenseRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddExpenseRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddExpenseRecordProps) {
   const [formData, setFormData] = useState({
      date_of_expense: "",
      cost: "",
      expense_type: "",
      expense_description: "",
      paid_to: "",
      receipt_number: "",
      payment_method: "",
      mileage_at_expense: "",
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
         const response = await fetch("/api/expense-records", {
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
            const newExpenseRecord = {
               id: responseData.id,
               user_id: userId,
               vehicle_id: vehicleId,
               ...formData,
            };

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!user["expense_records"]) {
               user["expense_records"] = [];
            }

            user["expense_records"].push(newExpenseRecord);
            localStorage.setItem("user", JSON.stringify(user));
            setRender(!render);
            onClose();
         } else {
            console.error("Failed to add expense record");
         }
      } catch (error) {
         console.error("Error adding expense record:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Expense Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new expense record for your
               vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='date_of_expense'>Date of Expense</Label>
                  <Input
                     id='date_of_expense'
                     name='date_of_expense'
                     type='date'
                     value={formData.date_of_expense}
                     onChange={handleChange}
                     required
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
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='expense_type'>Expense Type</Label>
                  <Select
                     name='expense_type'
                     value={formData.expense_type}
                     onValueChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           expense_type: value,
                        }))
                     }
                  >
                     <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select expense type' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='fuel'>Fuel</SelectItem>
                        <SelectItem value='maintenance'>Maintenance</SelectItem>
                        <SelectItem value='insurance'>Insurance</SelectItem>
                        <SelectItem value='repair'>Repair</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor='expense_description'>
                     Expense Description
                  </Label>
                  <Textarea
                     id='expense_description'
                     name='expense_description'
                     value={formData.expense_description}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='paid_to'>Paid To</Label>
                  <Input
                     id='paid_to'
                     name='paid_to'
                     value={formData.paid_to}
                     onChange={handleChange}
                  />
               </div>
               <div>
                  <Label htmlFor='receipt_number'>Receipt Number</Label>
                  <Input
                     id='receipt_number'
                     name='receipt_number'
                     value={formData.receipt_number}
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
                  <Label htmlFor='mileage_at_expense'>Mileage at Expense</Label>
                  <Input
                     id='mileage_at_expense'
                     name='mileage_at_expense'
                     type='number'
                     value={formData.mileage_at_expense}
                     onChange={handleChange}
                  />
               </div>
               <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Adding Expense...
                     </>
                  ) : (
                     "Add Expense Record"
                  )}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
