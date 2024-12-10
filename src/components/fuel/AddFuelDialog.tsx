"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
   DialogTrigger,
} from "@/components/ui/dialog";

export function AddFuelUpForm() {
   const [open, setOpen] = useState(false);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // TODO: Implement form submission logic
      setOpen(false);
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className='w-full mb-6'>Add a Record</Button>
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle>New Fuel - Up</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='odometer'>Odometer</Label>
                  <Input id='odometer' type='number' required />
               </div>
               <div>
                  <Label htmlFor='previousOdometer'>Previous Odometer</Label>
                  <Input id='previousOdometer' type='number' required />
               </div>
               <div>
                  <Label htmlFor='price'>Price</Label>
                  <Input id='price' type='number' step='0.01' required />
               </div>
               <div>
                  <Label htmlFor='volume'>Volume</Label>
                  <Input id='volume' type='number' step='0.01' required />
               </div>
               <div>
                  <Label htmlFor='totalCost'>Total Cost</Label>
                  <Input id='totalCost' type='number' step='0.01' required />
               </div>
               <div className='flex items-center space-x-2'>
                  <Checkbox id='partialFuelUp' />
                  <Label htmlFor='partialFuelUp'>Partial Fuel - Up?</Label>
               </div>
               <div className='flex items-center space-x-2'>
                  <Checkbox id='missedFuelUps' />
                  <Label htmlFor='missedFuelUps'>Missed Fuel Ups?</Label>
               </div>
               <div>
                  <Label htmlFor='vehicle'>Vehicle</Label>
                  <Input id='vehicle' required />
               </div>
               <div>
                  <Label htmlFor='dateTime'>Date / Time</Label>
                  <Input id='dateTime' type='datetime-local' required />
               </div>
               <div>
                  <Label htmlFor='paymentType'>Payment Type</Label>
                  <Select>
                     <SelectTrigger id='paymentType'>
                        <SelectValue placeholder='Select payment type' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='cash'>Cash</SelectItem>
                        <SelectItem value='credit'>Credit Card</SelectItem>
                        <SelectItem value='debit'>Debit Card</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor='kilometers'>Amount of kilometres</Label>
                  <Input id='kilometers' type='number' step='0.1' required />
               </div>
               <Button type='submit' className='w-full'>
                  Save
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
