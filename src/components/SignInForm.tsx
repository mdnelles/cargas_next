// src/components/SignInForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Loading from "@/components/loading";
import toast, { Toaster } from "react-hot-toast";

export default function SignInPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const router = useRouter();

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            const data = await response.json();

            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            //
            router.push("/dashboard");
         } else {
            const data = await response.json();
            toast.error(data.message || "An error occurred during sign in.");
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
                  Sign In
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
                     value={formData.email}
                     onChange={handleChange}
                  />
               </div>

               <div>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                     <Input
                        id='password'
                        name='password'
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
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
                        name='rememberMe'
                        type='checkbox'
                        className='h-4 w-4 text-[#93E7FF] focus:ring-[#93E7FF] border-gray-300 rounded'
                        checked={formData.rememberMe}
                        onChange={handleChange}
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
                  disabled={isLoading}
               >
                  {isLoading ? <Loading text='Signing In...' /> : "Sign In"}
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
