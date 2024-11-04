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

            <form className='space-y-6'>
               <div>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' type='text' required />
               </div>

               <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' required />
               </div>

               <div>
                  <Label htmlFor='country'>Country</Label>
                  <Select>
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
                  <Input id='password' type='password' required />
               </div>

               <div className='flex items-center'>
                  <input
                     id='terms'
                     type='checkbox'
                     className='h-4 w-4 text-[#93E7FF] focus:ring-[#93E7FF] border-gray-300 rounded'
                     required
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
