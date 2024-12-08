import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function parseNumber(value: number | string | null): number {
   if (value === null) return 0;
   const parsed = typeof value === "string" ? parseFloat(value) : value;
   return isNaN(parsed) ? 0 : parsed;
}
