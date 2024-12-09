export interface FuelUp {
   id: number;
   odometer: number;
   previousOdometer: number | null;
   price: number;
   volume: number;
   total_cost: number;
   isPartialFuelUp: boolean;
   isMissedFuelUp: boolean;
   vehicle: string;
   date_time: string;
   paymentType: string | null;
   kilometers: number | null;
}
