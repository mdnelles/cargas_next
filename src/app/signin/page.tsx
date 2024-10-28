"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignInPage() {
   const [showPassword, setShowPassword] = useState(false);

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
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
                  Sign In
               </h1>
            </div>

            <form className='space-y-6'>
               <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' required />
               </div>

               <div>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                     <Input
                        id='password'
                        type={showPassword ? "text" : "password"}
                        required
                     />
                     <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={togglePasswordVisibility}
                     >
                        {showPassword ? (
                           <EyeOffIcon className='h-5 w-5 text-gray-400' />
                        ) : (
                           <EyeIcon className='h-5 w-5 text-gray-400' />
                        )}
                     </button>
                  </div>
               </div>

               <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                     <input
                        id='remember-me'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 text-[#93E7FF] focus:ring-[#93E7FF] border-gray-300 rounded'
                     />
                     <label
                        htmlFor='remember-me'
                        className='ml-2 block text-sm text-gray-900'
                     >
                        Remember me
                     </label>
                  </div>

                  <Link
                     href='/forgot-password'
                     className='text-sm link-prominent'
                  >
                     Forgot your password?
                  </Link>
               </div>

               <Button
                  type='submit'
                  className='w-full bg-[#93E7FF] hover:bg-[#7DCEE6] text-[#333]'
               >
                  Sign In
               </Button>
            </form>

            <div className='mt-4'>
               <p className='text-center text-sm text-gray-600'>
                  Don't have an account?{" "}
                  <Link href='/signup' className='link-prominent'>
                     Sign up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
