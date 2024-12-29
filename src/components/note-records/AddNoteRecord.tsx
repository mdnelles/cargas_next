"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

interface AddNoteRecordProps {
   vehicleId: number;
   userId: number;
   render: boolean;
   setRender: (value: boolean) => void;
   onClose: () => void;
}

export default function AddNoteRecord({
   vehicleId,
   userId,
   onClose,
   render,
   setRender,
}: AddNoteRecordProps) {
   const [formData, setFormData] = useState({
      note_date: "",
      title: "",
      content: "",
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
      const response = await fetch("/api/note-records", {
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
         const newNoteRecord = {
            id: responseData.id,
            user_id: userId,
            vehicle_id: vehicleId,
            ...formData,
         };

         const user = JSON.parse(localStorage.getItem("user") || "{}");

         if (!user["note_records"]) {
            user["note_records"] = [];
         }

         user["note_records"].push(newNoteRecord);
         localStorage.setItem("user", JSON.stringify(user));
         setRender(!render);
         onClose();
      } else {
         console.error("Failed to add note record");
      }
   };

   return (
      <Dialog open={true} onOpenChange={onClose}>
         <DialogContent className='max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Add New Note Record</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               Fill in the details below to add a new note for your vehicle.
            </DialogDescription>
            <form onSubmit={handleSubmit} className='space-y-4'>
               <div>
                  <Label htmlFor='note_date'>Date of Note</Label>
                  <Input
                     id='note_date'
                     name='note_date'
                     type='date'
                     value={formData.note_date}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                     id='title'
                     name='title'
                     value={formData.title}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div>
                  <Label htmlFor='content'>Content</Label>
                  <Textarea
                     id='content'
                     name='content'
                     value={formData.content}
                     onChange={handleChange}
                     required
                  />
               </div>
               <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Adding Note...
                     </>
                  ) : (
                     "Add Note Record"
                  )}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
