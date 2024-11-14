import React from "react";
import TopNav from "./top-nav";

interface DashboardTemplateProps {
   title: string;
   children: React.ReactNode;
}

export default function DashboardTemplate({
   title,
   children,
}: DashboardTemplateProps) {
   return (
      <div className='min-h-screen bg-gray-100'>
         <TopNav />
         <main className='container mx-auto px-4 py-8'>
            <h3 className='font-bold mb-6'>{title}</h3>
            {children}
         </main>
      </div>
   );
}
