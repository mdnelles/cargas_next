"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState("");
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const response = await fetch("/api/forgot-password", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
         });

         if (response.ok) {
            toast.success(
               "Password reset email sent. Please check your inbox."
            );
            // Optionally, redirect to login page after a delay
            setTimeout(() => router.push("/signin"), 3000);
         } else {
            const data = await response.json();
            toast.error(data.message || "An error occurred. Please try again.");
         }
      } catch (err) {
         toast.error("An error occurred. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className='min-h-screen bg-[#93E7FF] flex flex-col items-center justify-center p-4'>
         <Toaster position='top-center' reverseOrder={false} />
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
                  Forgot Password
               </h1>
            </div>

            <form className='space-y-6' onSubmit={handleSubmit}>
               <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                     id='email'
                     name='email'
                     type='email'
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>

               <Button
                  type='submit'
                  className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <Loading text='Sending...' />
                  ) : (
                     "Send Reset Link"
                  )}
               </Button>
            </form>

            <div className='mt-4'>
               <p className='text-center text-sm text-gray-600'>
                  Remember your password?{" "}
                  <Link href='/signin' className='link-prominent'>
                     Sign in
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
