"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

export default function SignUpPage() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      country: "",
      password: "",
      terms: false,
   });
   const [error, setError] = useState("");
   const router = useRouter();

   const handleChange = (e: any) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setError("");

      if (!formData.terms) {
         setError("You must agree to the terms and conditions");
         return;
      }

      try {
         const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            router.push("/dashboard"); // Redirect to dashboard on success
         } else {
            const data = await response.json();
            setError(data.message || "An error occurred during signup");
         }
      } catch (err) {
         setError("An error occurred. Please try again.");
      }
   };

   return (
      <div className='min-h-screen bg-[#93E7FF] flex flex-col items-center justify-center p-4'>
         <div className='w-full max-w-md bg-white rounded-lg shadow-md py-12 px-8 space-y-8'>
            <div className='text-center'>
               <Image
                  src='/assets/img/logoLarge.png'
                  alt='CarGas Logo'
                  width={200}
                  height={80}
                  className='mx-auto'
               />
               <h1 className='mt-6 text-2xl font-bold text-gray-900'>
                  Create Profile
               </h1>
            </div>

            <form className='space-y-6' onSubmit={handleSubmit}>
               <div>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                     id='name'
                     name='name'
                     type='text'
                     required
                     value={formData.name}
                     onChange={handleChange}
                  />
               </div>

               <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                     id='email'
                     name='email'
                     type='email'
                     required
                     value={formData.email}
                     onChange={handleChange}
                  />
               </div>

               <div>
                  <Label htmlFor='country'>Country</Label>
                  <Select
                     name='country'
                     value={formData.country}
                     onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, country: value }))
                     }
                  >
                     <SelectTrigger>
                        <SelectValue placeholder='Select a country' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='panama'>Panama</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                     id='password'
                     name='password'
                     type='password'
                     required
                     value={formData.password}
                     onChange={handleChange}
                  />
               </div>

               <div className='flex items-center'>
                  <input
                     id='terms'
                     name='terms'
                     type='checkbox'
                     className='h-4 w-4 text-[#93E7FF] focus:ring-[#93E7FF] border-gray-300 rounded'
                     required
                     checked={formData.terms}
                     onChange={handleChange}
                  />
                  <label
                     htmlFor='terms'
                     className='ml-2 block text-sm text-gray-900'
                  >
                     By continuing, I confirm that I have read & agree to the{" "}
                     <Link
                        href='/terms'
                        className='font-medium text-[#93E7FF] hover:underline'
                     >
                        Terms & conditions
                     </Link>{" "}
                     and{" "}
                     <Link
                        href='/privacy'
                        className='font-medium text-[#93E7FF] hover:underline'
                     >
                        Privacy policy
                     </Link>
                  </label>
               </div>

               {error && <p className='text-red-500 text-sm'>{error}</p>}

               <Button
                  type='submit'
                  className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
               >
                  Register
               </Button>
            </form>

            <div className='text-center text-sm'>
               <p>
                  Already have an account?{" "}
                  <Link
                     href='/signin'
                     className='font-medium text-[#93E7FF] hover:underline'
                  >
                     Sign In
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
