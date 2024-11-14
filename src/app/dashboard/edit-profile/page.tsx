// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import DashboardTemplate from "../dashboard-template";

export default function DashboardPage() {
   const [name, setName] = useState("John Doe");
   const [email, setEmail] = useState("john@example.com");
   const [country, setCountry] = useState("Panama");

   const handleSave = () => {
      // Here you would typically send this data to your backend
      console.log("Saving profile:", { name, email, country });
      // You could also show a success message to the user here
   };
   return (
      <DashboardTemplate title='Edit Profile'>
         <Card className='max-w-md mx-auto'>
            <CardHeader>
               <CardTitle>Change User Profile</CardTitle>
            </CardHeader>
            <CardContent>
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     handleSave();
                  }}
                  className='space-y-4'
               >
                  <div className='space-y-2'>
                     <Label htmlFor='name'>Name</Label>
                     <Input
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter your name'
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='email'>Email</Label>
                     <Input
                        id='email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your email'
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='country'>Country</Label>
                     <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id='country'>
                           <SelectValue placeholder='Select a country' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='Panama'>Panama</SelectItem>
                           <SelectItem value='USA'>USA</SelectItem>
                           <SelectItem value='Canada'>Canada</SelectItem>
                           {/* Add more countries as needed */}
                        </SelectContent>
                     </Select>
                  </div>
                  <Button
                     type='submit'
                     className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
                  >
                     Save
                  </Button>
               </form>
            </CardContent>
         </Card>
      </DashboardTemplate>
   );
}
