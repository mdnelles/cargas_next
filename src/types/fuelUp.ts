export interface FuelUp {
   id: number;
   odometer: number;
   previousOdometer: number | null;
   price: number;
   volume: number;
   totalCost: number;
   isPartialFuelUp: boolean;
   isMissedFuelUp: boolean;
   vehicle: string;
   dateTime: string;
   paymentType: string | null;
   kilometers: number | null;
}
