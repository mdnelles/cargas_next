"use client";

import { useState, useEffect } from "react";
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
import { FuelUp } from "@/types/fuelUp";

interface AddFuelUpFormProps {
   onAddFuelUp: (newFuelUp: FuelUp) => void;
}

export function AddFuelUpForm({ onAddFuelUp }: AddFuelUpFormProps) {
   const [open, setOpen] = useState(false);
   const [vehicles, setVehicles] = useState([]);
   const [formData, setFormData] = useState({
      odometer: "",
      previousOdometer: "",
      price: "",
      volume: "",
      totalCost: "",
      isPartialFuelUp: false,
      isMissedFuelUp: false,
      vehicle: "",
      vehicle_id: 0,
      dateTime: "",
      paymentType: "",
      kilometers: "",
   });

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.vehicles && Array.isArray(user.vehicles)) {
         setVehicles(user.vehicles);
      } else {
         setVehicles([]);
      }
   }, []);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleVehicleSelect = (vehicleId: string) => {
      const selectedVehicle: any = vehicles.find(
         (vehicle: any) => vehicle.id.toString() === vehicleId
      );
      setFormData((prev) => ({
         ...prev,
         vehicle: `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`,
         vehicle_id: selectedVehicle.id,
      }));
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
         const token = JSON.parse(localStorage.getItem("user") || "{}").token;
         const response = await fetch("/api/fuel-ups", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
               ...formData,
               odometer: parseFloat(formData.odometer),
               price: parseFloat(formData.price),
               volume: parseFloat(formData.volume),
               totalCost: parseFloat(formData.totalCost),
               kilometers: parseFloat(formData.kilometers),
            }),
         });

         if (!response.ok) {
            throw new Error("Failed to add fuel-up record");
         }

         const newFuelUp = await response.json();
         onAddFuelUp(newFuelUp);
         setOpen(false);
         setFormData({
            odometer: "",
            previousOdometer: "",
            price: "",
            volume: "",
            totalCost: "",
            isPartialFuelUp: false,
            isMissedFuelUp: false,
            vehicle: "",
            vehicle_id: 0,
            dateTime: "",
            paymentType: "",
            kilometers: "",
         });
      } catch (error) {
         console.error("Error adding fuel-up record:", error);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className='w-full mb-6'>Add a Record</Button>
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle>New Fuel-Up</DialogTitle>
            </DialogHeader>
            <div className='max-h-[60vh] overflow-y-auto pr-4 -mr-4'>
               <form onSubmit={handleSubmit} className='space-y-4 ml-1'>
                  {vehicles.length === 0 && (
                     <p className='text-red-500'>
                        No vehicles found. Please add a vehicle first.
                     </p>
                  )}
                  <div>
                     <Label htmlFor='vehicle'>Vehicle</Label>
                     <Select
                        onValueChange={(value) => handleVehicleSelect(value)}
                        disabled={vehicles.length === 0}
                     >
                        <SelectTrigger id='vehicle'>
                           <SelectValue placeholder='Select a vehicle' />
                        </SelectTrigger>
                        <SelectContent>
                           {vehicles.map((vehicle: any) => (
                              <SelectItem
                                 key={vehicle.id}
                                 value={vehicle.id.toString()}
                              >
                                 {`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <input
                        type='hidden'
                        name='vehicle_id'
                        value={formData.vehicle_id}
                        readOnly
                     />
                  </div>
                  <div>
                     <Label htmlFor='odometer'>Odometer</Label>
                     <Input
                        id='odometer'
                        name='odometer'
                        type='number'
                        required
                        value={formData.odometer}
                        onChange={handleChange}
                     />
                  </div>
                  <div>
                     <Label htmlFor='previousOdometer'>Previous Odometer</Label>
                     <Input
                        id='previousOdometer'
                        name='previousOdometer'
                        type='number'
                        required
                        value={formData.previousOdometer}
                        onChange={handleChange}
                     />
                  </div>
                  <div>
                     <Label htmlFor='price'>Price</Label>
                     <Input
                        id='price'
                        name='price'
                        type='number'
                        step='0.01'
                        required
                        value={formData.price}
                        onChange={handleChange}
                     />
                  </div>
                  <div>
                     <Label htmlFor='volume'>Volume</Label>
                     <Input
                        id='volume'
                        name='volume'
                        type='number'
                        step='0.01'
                        required
                        value={formData.volume}
                        onChange={handleChange}
                     />
                  </div>
                  <div>
                     <Label htmlFor='totalCost'>Total Cost</Label>
                     <Input
                        id='totalCost'
                        name='totalCost'
                        type='number'
                        step='0.01'
                        required
                        value={formData.totalCost}
                        onChange={handleChange}
                     />
                  </div>
                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='isPartialFuelUp'
                        name='isPartialFuelUp'
                        checked={formData.isPartialFuelUp}
                        onCheckedChange={(checked) =>
                           handleChange({
                              target: {
                                 name: "isPartialFuelUp",
                                 type: "checkbox",
                                 checked,
                              },
                           } as React.ChangeEvent<HTMLInputElement>)
                        }
                     />
                     <Label htmlFor='isPartialFuelUp'>Partial Fuel-Up?</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='isMissedFuelUp'
                        name='isMissedFuelUp'
                        checked={formData.isMissedFuelUp}
                        onCheckedChange={(checked) =>
                           handleChange({
                              target: {
                                 name: "isMissedFuelUp",
                                 type: "checkbox",
                                 checked,
                              },
                           } as React.ChangeEvent<HTMLInputElement>)
                        }
                     />
                     <Label htmlFor='isMissedFuelUp'>Missed Fuel Ups?</Label>
                  </div>
                  <div>
                     <Label htmlFor='dateTime'>Date / Time</Label>
                     <Input
                        id='dateTime'
                        name='dateTime'
                        type='datetime-local'
                        required
                        value={formData.dateTime}
                        onChange={handleChange}
                     />
                  </div>
                  <div>
                     <Label htmlFor='paymentType'>Payment Type</Label>
                     <Select
                        onValueChange={(value) =>
                           setFormData((prev) => ({
                              ...prev,
                              paymentType: value,
                           }))
                        }
                     >
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
                     <Label htmlFor='kilometers'>Kilometers</Label>
                     <Input
                        id='kilometers'
                        name='kilometers'
                        type='number'
                        step='0.1'
                        required
                        value={formData.kilometers}
                        onChange={handleChange}
                     />
                  </div>
                  <Button
                     type='submit'
                     className='w-full'
                     disabled={vehicles.length === 0}
                  >
                     Save
                  </Button>
               </form>
            </div>
         </DialogContent>
      </Dialog>
   );
}
