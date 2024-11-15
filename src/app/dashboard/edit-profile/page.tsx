"use client";

import { useState, useEffect } from "react";
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

interface UserInfo {
   name: string;
   email: string;
   country: string;
}

async function getUserInfo(): Promise<UserInfo> {
   const response = await fetch("/api/user");
   if (!response.ok) {
      throw new Error("Failed to fetch user info");
   }
   return response.json();
}

export default function DashboardPage() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [country, setCountry] = useState("");

   useEffect(() => {
      getUserInfo()
         .then((userInfo) => {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setCountry(userInfo.country);
         })
         .catch((error) => {
            console.error("Error fetching user info:", error);
            // Handle error (e.g., redirect to login page)
         });
   }, []);

   const handleSave = async () => {
      try {
         const response = await fetch("/api/user", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, country }),
         });

         if (!response.ok) {
            throw new Error("Failed to update profile");
         }

         // Show success message
         alert("Profile updated successfully");
      } catch (error) {
         console.error("Error updating profile:", error);
         alert("Failed to update profile. Please try again.");
      }
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
