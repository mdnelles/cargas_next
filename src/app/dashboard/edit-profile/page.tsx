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
import { useRouter } from "next/navigation";

interface UserInfo {
   id: string;
   name: string;
   email: string;
   country: string;
}

async function getUserInfo(id: string): Promise<UserInfo> {
   const response = await fetch(`/api/edit-user?id=${id}`);
   if (!response.ok) {
      throw new Error("Failed to fetch user info");
   }
   return response.json();
}

export default function EditProfilePage() {
   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      const userId = "1"; // Replace this with the actual user ID, e.g., from authentication context
      getUserInfo(userId)
         .then((info) => {
            setUserInfo(info);
         })
         .catch((error) => {
            console.error("Error fetching user info:", error);
         });
   }, []);

   const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userInfo) return;

      setIsLoading(true);
      try {
         const response = await fetch("/api/edit-user", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
         });

         if (!response.ok) {
            throw new Error("Failed to update profile");
         }

         alert("Profile updated successfully");
         router.refresh();
      } catch (error) {
         console.error("Error updating profile:", error);
         alert("Failed to update profile. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   if (!userInfo) {
      return <div>Loading...</div>;
   }

   return (
      <DashboardTemplate title='Edit Profile'>
         <Card className='max-w-md mx-auto'>
            <CardHeader>
               <CardTitle>Change User Profile</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSave} className='space-y-4'>
                  <div className='space-y-2'>
                     <Label htmlFor='name'>Name</Label>
                     <Input
                        id='name'
                        value={userInfo.name}
                        onChange={(e) =>
                           setUserInfo({ ...userInfo, name: e.target.value })
                        }
                        placeholder='Enter your name'
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='email'>Email</Label>
                     <Input
                        id='email'
                        type='email'
                        value={userInfo.email}
                        onChange={(e) =>
                           setUserInfo({ ...userInfo, email: e.target.value })
                        }
                        placeholder='Enter your email'
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='country'>Country</Label>
                     <Select
                        value={userInfo.country}
                        onValueChange={(value) =>
                           setUserInfo({ ...userInfo, country: value })
                        }
                     >
                        <SelectTrigger id='country'>
                           <SelectValue placeholder='Select a country' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='Belize'>Belize</SelectItem>
                           <SelectItem value='Canada'>Canada</SelectItem>
                           <SelectItem value='Costa Rica'>
                              Costa Rica
                           </SelectItem>
                           <SelectItem value='El Salvador'>
                              El Salvador
                           </SelectItem>
                           <SelectItem value='Guatemala'>Guatemala</SelectItem>
                           <SelectItem value='Honduras'>Honduras</SelectItem>
                           <SelectItem value='Nicaragua'>Nicaragua</SelectItem>
                           <SelectItem value='Panama'>Panama</SelectItem>
                           <SelectItem value='USA'>USA</SelectItem>
                           {/* Add more countries as needed */}
                        </SelectContent>
                     </Select>
                  </div>
                  <Button
                     type='submit'
                     className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
                     disabled={isLoading}
                  >
                     {isLoading ? "Saving..." : "Save"}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </DashboardTemplate>
   );
}
