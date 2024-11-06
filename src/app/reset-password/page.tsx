"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
   const [isLoading, setIsLoading] = useState(false);
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (password !== confirmPassword) {
         toast.error("Passwords do not match");
         setIsLoading(false);
         return;
      }

      try {
         const response = await fetch("/api/reset-password", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
         });

         if (response.ok) {
            toast.success("Password reset successfully");
            // Redirect to login page after a delay
            setTimeout(() => router.push("/auth/signin"), 3000);
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
                  Reset Password
               </h1>
            </div>

            <form className='space-y-6' onSubmit={handleSubmit}>
               <div>
                  <Label htmlFor='password'>New Password</Label>
                  <Input
                     id='password'
                     name='password'
                     type='password'
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div>
                  <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                  <Input
                     id='confirmPassword'
                     name='confirmPassword'
                     type='password'
                     required
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  />
               </div>

               <Button
                  type='submit'
                  className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <Loading text='Resetting...' />
                  ) : (
                     "Reset Password"
                  )}
               </Button>
            </form>

            <div className='mt-4'>
               <p className='text-center text-sm text-gray-600'>
                  Remember your password?{" "}
                  <Link
                     href='signin'
                     className='text-[#93E7FF] hover:underline'
                  >
                     Sign in
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
