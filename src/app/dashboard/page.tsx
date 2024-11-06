import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
   const cookieStore = await cookies();
   const token = cookieStore.get("auth_token");

   if (!token || !verifyToken(token.value)) {
      redirect("/signin");
   }

   return (
      <div className='container mx-auto p-4'>
         <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
         <p>Welcome to your dashboard!</p>
      </div>
   );
}
