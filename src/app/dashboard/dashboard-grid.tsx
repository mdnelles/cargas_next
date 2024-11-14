// src/app/dashboard/dashboard-grid.tsx
"use client";

import Link from "next/link";
import {
   Droplet,
   Wrench,
   Receipt,
   Map,
   FileText,
   AlertTriangle,
   ShoppingCart,
   TrendingUp,
   Car,
   Search,
   BarChart,
   Settings,
} from "lucide-react";

const dashboardItems = [
   {
      name: "Fuel Up Records",
      icon: Droplet,
      href: "/dashboard/fuel-up-records",
   },
   {
      name: "Service Records",
      icon: Wrench,
      href: "/dashboard/service-records",
   },
   {
      name: "Expense Records",
      icon: Receipt,
      href: "/dashboard/expense-records",
   },
   { name: "Trip Records", icon: Map, href: "/dashboard/trip-records" },
   { name: "Note Records", icon: FileText, href: "/dashboard/note-records" },
   {
      name: "Accident Records",
      icon: AlertTriangle,
      href: "/dashboard/accident-records",
   },
   {
      name: "Purchase Records",
      icon: ShoppingCart,
      href: "/dashboard/purchase-records",
   },
   { name: "Sold Records", icon: TrendingUp, href: "/dashboard/sold-records" },
   { name: "Vehicle Records", icon: Car, href: "/dashboard/vehicle-records" },
   { name: "Browse Records", icon: Search, href: "/dashboard/browse-records" },
   { name: "Predictions", icon: BarChart, href: "/dashboard/predictions" },
   { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardGrid() {
   return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
         {dashboardItems.map((item) => (
            <Link
               key={item.name}
               href={item.href}
               className='flex flex-col items-center justify-center p-4 bg-[#E6FFFF] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-[#D1FFFF]'
            >
               <item.icon className='w-8 h-8 mb-2 text-[#93E7FF]' />
               <span className='text-sm text-center font-medium text-gray-700'>
                  {item.name}
               </span>
            </Link>
         ))}
      </div>
   );
}
