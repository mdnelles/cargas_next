"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, LogOut, UserCog } from "lucide-react";

export default function TopNav() {
   const router = useRouter();

   const handleLogout = async () => {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
         router.push("/login");
      }
   };

   return (
      <nav className='bg-[#93E7FF] shadow'>
         <div className='container mx-auto px-4'>
            <div className='flex justify-between items-center py-4'>
               <Link
                  href='/dashboard'
                  className='text-xl font-bold text-gray-800'
               >
                  CarGas
               </Link>
               <div className='flex items-center space-x-4'>
                  <Link
                     href='/dashboard'
                     className='text-gray-600 hover:text-gray-800'
                  >
                     <Home className='w-6 h-6' />
                     <span className='sr-only'>Home</span>
                  </Link>
                  <Link
                     href='/dashboard/edit-profile'
                     className='text-gray-600 hover:text-gray-800'
                  >
                     <UserCog className='w-6 h-6' />
                     <span className='sr-only'>Edit Profile</span>
                  </Link>
                  <button
                     onClick={handleLogout}
                     className='text-gray-600 hover:text-gray-800'
                  >
                     <LogOut className='w-6 h-6' />
                     <span className='sr-only'>Logout</span>
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
}
