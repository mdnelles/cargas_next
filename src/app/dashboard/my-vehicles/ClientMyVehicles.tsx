"use client";

import React, { useState, useEffect } from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import DashboardTemplate from "../dashboard-template";
import Loading from "@/components/loading";
import MyVehicles from "@/components/MyVehicles";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

export default function ClientMyVehicles() {
   const [makes, setMakes] = useState<string[]>([]);
   const [models, setModels] = useState<string[]>([]);
   const [selectedMake, setSelectedMake] = useState<string>("");
   const [selectedModel, setSelectedModel] = useState<string>("");
   const [vehicleData, setVehicleData] = useState<any[]>([]);
   const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // Fetch selected vehicles from localStorage
   useEffect(() => {
      const loadSelectedVehicles = () => {
         const userData = JSON.parse(localStorage.getItem("user") || "{}");
         const vehicles = userData.vehicles || [];
         setSelectedVehicles(vehicles);
      };

      loadSelectedVehicles();

      // Listen for changes in localStorage
      const handleStorageChange = () => {
         loadSelectedVehicles();
      };
      window.addEventListener("storage", handleStorageChange);

      return () => {
         window.removeEventListener("storage", handleStorageChange);
      };
   }, []);

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
               if (Array.isArray(data) && data.length > 0) {
                  setVehicleData(data);
               } else {
                  setVehicleData([]);
               }
            } catch (err) {
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
      setSelectedMake(value);
      setSelectedModel("");
      setVehicleData([]);
   };

   const handleModelChange = (value: string) => {
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
         const userData = JSON.parse(localStorage.getItem("user") || "{}");

         if (!userData || !userData.token) {
            console.error("User data or token not found in localStorage");
            return;
         }

         const vehicles: Array<{
            id: number;
            year: number;
            make: string;
            model: string;
         }> = userData.vehicles || [];

         if (checked) {
            if (!vehicles.find((vehicle) => vehicle.id === id)) {
               vehicles.push({ id, year, make, model });
            }
         } else {
            const index = vehicles.findIndex((vehicle) => vehicle.id === id);
            if (index > -1) {
               vehicles.splice(index, 1);
            }
         }

         userData.vehicles = vehicles;
         localStorage.setItem("user", JSON.stringify(userData));
         setSelectedVehicles(vehicles);

         await fetch("/api/vehicle-user-link", {
            method: checked ? "POST" : "DELETE",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${userData.token}`,
            },
            body: JSON.stringify({
               user_id: userData.id,
               vehicle_id: id,
               year,
               make,
               model,
            }),
         });
      } catch (error) {
         console.error("Error updating user vehicles:", error);
      }
   };

   return (
      <DashboardTemplate title='My Vehicles'>
         {error && <div className='text-red-500'>{error}</div>}
         {isLoading ? (
            <Loading />
         ) : (
            <>
               <h3>Selected Vehicles</h3>
               {selectedVehicles.length > 0 ? (
                  <div className='overflow-x-auto'>
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Make</TableHead>
                              <TableHead>Model</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>ID</TableHead>
                              <TableHead>Actions</TableHead>{" "}
                              {/* New column for actions */}
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {selectedVehicles.map((vehicle, index) => (
                              <TableRow key={index}>
                                 <TableCell>{vehicle.make}</TableCell>
                                 <TableCell>{vehicle.model}</TableCell>
                                 <TableCell>{vehicle.year}</TableCell>
                                 <TableCell>{vehicle.id}</TableCell>
                                 <TableCell>
                                    {/* Delete button */}
                                    <button
                                       className='text-red-500 hover:underline'
                                       onClick={() =>
                                          handleChecked(
                                             false,
                                             vehicle.id,
                                             vehicle.year,
                                             vehicle.make,
                                             vehicle.model
                                          )
                                       }
                                    >
                                       Delete
                                    </button>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               ) : (
                  <div>No vehicles selected</div>
               )}

               <div className='space-y-4'>
                  <hr />
                  <h3>Add Vehicles</h3>
                  <div className='flex space-x-4'>
                     <Select
                        onValueChange={handleMakeChange}
                        value={selectedMake}
                     >
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
            </>
         )}
      </DashboardTemplate>
   );
}
