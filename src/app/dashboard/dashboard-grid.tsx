// src/app/dashboard/dashboard-grid.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
   Droplet,
   Database,
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
      name: "My Vehicles",
      icon: Car,
      href: "/dashboard/my-vehicles",
   },
   {
      name: "Fuel Up Records",
      icon: Droplet,
      href: "/dashboard/fuel-up-records",
   },
   {
      name: "Car Data",
      icon: Database,
      href: "/dashboard/vehicle-data",
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
   // { name: "Vehicle Records", icon: Car, href: "/dashboard/vehicle-records" },
   // { name: "Browse Records", icon: Search, href: "/dashboard/browse-records" },
   // { name: "Predictions", icon: BarChart, href: "/dashboard/predictions" },
   // { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardGrid() {
   const [hasVehicles, setHasVehicles] = useState(false);

   useEffect(() => {
      // Check localStorage for user.vehicles
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (
         user.vehicles &&
         Array.isArray(user.vehicles) &&
         user.vehicles.length > 0
      ) {
         setHasVehicles(true);
      }
   }, []);

   return (
      <div>
         {!hasVehicles && (
            <div className='text-center text-red-500 font-bold mb-4'>
               You must first select at least one vehicle.
            </div>
         )}
         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {dashboardItems.map((item, index) => (
               <Link
                  key={item.name}
                  href={index === 0 || hasVehicles ? item.href : "#"}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-shadow duration-200 ${
                     index === 0 || hasVehicles
                        ? "bg-[#E6FFFF] hover:shadow-lg hover:bg-[#D1FFFF]"
                        : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                     if (index !== 0 && !hasVehicles) e.preventDefault();
                  }}
               >
                  <item.icon
                     className={`w-8 h-8 mb-2 ${
                        index === 0 || hasVehicles
                           ? "text-[#93E7FF]"
                           : "text-gray-500"
                     }`}
                  />
                  <span
                     className={`text-sm text-center font-medium ${
                        index === 0 || hasVehicles
                           ? "text-gray-700"
                           : "text-gray-500"
                     }`}
                  >
                     {item.name}
                  </span>
               </Link>
            ))}
         </div>
      </div>
   );
}
