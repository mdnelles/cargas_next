import { AppProvider } from "../store/AppContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "CarGas App",
   description: "Database-driven app for CarGas",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang='en'>
         <body className={inter.className}>
            <AppProvider>{children}</AppProvider>
         </body>
      </html>
   );
}
