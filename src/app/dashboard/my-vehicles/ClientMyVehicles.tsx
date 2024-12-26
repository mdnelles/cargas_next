"use client";

import React, { useState, useEffect } from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import VehicleDataTable from "@/components/VehicleDataTable";
import DashboardTemplate from "../dashboard-template";
import Loading from "@/components/loading";
import MyVehicles from "@/components/MyVehicles";

export default function ClientMyVehicles() {
   const user = localStorage.getItem("user");
   const [makes, setMakes] = useState<string[]>([]);
   const [models, setModels] = useState<string[]>([]);
   const [selectedMake, setSelectedMake] = useState<string>("");
   const [selectedModel, setSelectedModel] = useState<string>("");
   const [vehicleData, setVehicleData] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchMakes = async () => {
         try {
            setIsLoading(true);
            const response = await fetch("/api/get-vehicle-data");
            if (!response.ok) {
               throw new Error("Failed to fetch makes");
            }
            const data = await response.json();
            if (Array.isArray(data)) {
               setMakes(data);
            } else {
               throw new Error("Invalid data format for makes");
            }
         } catch (err) {
            setError("Failed to load vehicle makes. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };
      fetchMakes();
   }, []);

   useEffect(() => {
      const fetchModels = async () => {
         if (selectedMake) {
            try {
               setIsLoading(true);
               const response = await fetch(
                  `/api/get-vehicle-data?make=${selectedMake}`
               );
               if (!response.ok) {
                  throw new Error("Failed to fetch models");
               }
               const data = await response.json();
               if (Array.isArray(data)) {
                  setModels(data);
               } else {
                  throw new Error("Invalid data format for models");
               }
            } catch (err) {
               setError(
                  "Failed to load vehicle models. Please try again later."
               );
            } finally {
               setIsLoading(false);
            }
         } else {
            setModels([]);
         }
      };
      fetchModels();
   }, [selectedMake]);

   useEffect(() => {
      const fetchVehicleData = async () => {
         if (selectedMake && selectedModel) {
            try {
               setIsLoading(true);
               const response = await fetch(
                  `/api/get-vehicle-data?make=${encodeURIComponent(
                     selectedMake
                  )}&model=${encodeURIComponent(selectedModel)}`
               );
               if (!response.ok) {
                  throw new Error("Failed to fetch vehicle data");
               }
               const data = await response.json();
               console.log("Fetched vehicle data:", data);
               if (Array.isArray(data) && data.length > 0) {
                  setVehicleData(data);
               } else {
                  setVehicleData([]);
                  console.log(
                     "No data returned for the selected make and model"
                  );
               }
            } catch (err) {
               console.error("Error fetching vehicle data:", err);
               setError("Failed to load vehicle data. Please try again later.");
            } finally {
               setIsLoading(false);
            }
         } else {
            setVehicleData([]);
         }
      };
      fetchVehicleData();
   }, [selectedMake, selectedModel]);

   const handleMakeChange = (value: string) => {
      console.log("Selected Make:", value);
      setSelectedMake(value);
      setSelectedModel("");
      setVehicleData([]);
   };

   const handleModelChange = (value: string) => {
      console.log("Selected Model:", value);
      setSelectedModel(value);
   };

   const handleChecked = async (
      checked: boolean,
      id: number,
      year: number,
      make: string,
      model: string
   ) => {
      try {
         // Retrieve the user object from localStorage
         const userData = JSON.parse(localStorage.getItem("user") || "{}");

         if (!userData || !userData.token) {
            console.error("User data or token not found in localStorage");
            return;
         }

         const token = userData.token;

         // Ensure vehicles is an array
         const vehicles: Array<{
            id: number;
            year: number;
            make: string;
            model: string;
         }> = userData.vehicles || [];

         // Add or remove the vehicle object based on the checkbox state
         if (checked) {
            if (!vehicles.find((vehicle) => vehicle.id === id)) {
               console.log("Adding vehicle to user vehicles:", {
                  id,
                  year,
                  make,
                  model,
               });
               vehicles.push({ id, year, make, model });
            }
         } else {
            console.log("Removing vehicle ID from user vehicles:", id);
            const index = vehicles.findIndex((vehicle) => vehicle.id === id);
            if (index > -1) {
               vehicles.splice(index, 1);
            }
         }

         // Update the user object in localStorage
         userData.vehicles = vehicles;
         localStorage.setItem("user", JSON.stringify(userData));

         // API call with token in the Authorization header
         await fetch("/api/vehicle-user-link", {
            method: checked ? "POST" : "DELETE",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
               user_id: userData.id,
               vehicle_id: id,
               year,
               make,
               model,
            }),
         });

         console.log("Updated vehicles in localStorage:", vehicles);
      } catch (error) {
         console.error("Error updating user vehicles:", error);
      }
   };

   return (
      <DashboardTemplate title='My Vehicles'>
         {error ? (
            <div className='text-red-500'>{error}</div>
         ) : isLoading ? (
            <Loading />
         ) : (
            <div className='space-y-4'>
               <div className='flex space-x-4'>
                  <Select onValueChange={handleMakeChange} value={selectedMake}>
                     <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select Make' />
                     </SelectTrigger>
                     <SelectContent>
                        {makes.map((make) => (
                           <SelectItem key={make} value={make}>
                              {make}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Select
                     onValueChange={handleModelChange}
                     value={selectedModel}
                     disabled={!selectedMake}
                  >
                     <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select Model' />
                     </SelectTrigger>
                     <SelectContent>
                        {models.map((model) => (
                           <SelectItem key={model} value={model}>
                              {model}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {selectedMake && selectedModel && vehicleData.length > 0 && (
                  <MyVehicles
                     data={vehicleData}
                     handleChecked={handleChecked}
                  />
               )}
            </div>
         )}
      </DashboardTemplate>
   );
}
