import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { parseNumber } from "@/lib/utils";
import { FuelUp } from "@/types/fuelUp";

interface FuelUpDetailsDialogProps {
   fuelUp: FuelUp;
   open: boolean;
   onClose: () => void;
}

export function FuelUpDetailsDialog({
   fuelUp,
   open,
   onClose,
}: FuelUpDetailsDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Fuel-Up Details</DialogTitle>
               <DialogDescription>
                  Detailed information about the fuel-up record.
               </DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-2 gap-4'>
               <div>
                  <strong>Date:</strong>{" "}
                  {new Date(fuelUp.dateTime).toLocaleString()}
               </div>
               <div>
                  <strong>Odometer:</strong>{" "}
                  {parseNumber(fuelUp.odometer).toFixed(1)}
               </div>
               <div>
                  <strong>Previous Odometer:</strong>{" "}
                  {fuelUp.previousOdometer
                     ? parseNumber(fuelUp.previousOdometer).toFixed(1)
                     : "N/A"}
               </div>
               <div>
                  <strong>Volume:</strong>{" "}
                  {parseNumber(fuelUp.volume).toFixed(2)}
               </div>
               <div>
                  <strong>Price:</strong> $
                  {parseNumber(fuelUp.price).toFixed(2)}
               </div>
               <div>
                  <strong>Total Cost:</strong> $
                  {parseNumber(fuelUp.totalCost).toFixed(2)}
               </div>
               <div>
                  <strong>Partial Fuel-Up:</strong>{" "}
                  {fuelUp.isPartialFuelUp ? "Yes" : "No"}
               </div>
               <div>
                  <strong>Missed Fuel-Up:</strong>{" "}
                  {fuelUp.isMissedFuelUp ? "Yes" : "No"}
               </div>
               <div>
                  <strong>Vehicle ID:</strong> {fuelUp.vehicle}
               </div>
               <div>
                  <strong>Payment Type:</strong> {fuelUp.paymentType || "N/A"}
               </div>
               <div>
                  <strong>Kilometers Added:</strong>{" "}
                  {fuelUp.kilometers
                     ? parseNumber(fuelUp.kilometers).toFixed(1)
                     : "N/A"}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
