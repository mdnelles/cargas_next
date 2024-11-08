// src/app/signin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
   const router = useRouter();

   useEffect(() => {
      const checkAuth = async () => {
         const response = await fetch("/api/check-auth");
         if (response.ok) {
            router.push("/dashboard");
         }
      };

      checkAuth();
   }, [router]);

   return (
      <div className='min-h-screen bg-[#93E7FF] flex flex-col items-center justify-center p-4'>
         <SignInForm />
      </div>
   );
}
