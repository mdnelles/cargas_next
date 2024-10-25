"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
   name: string;
   email: string;
};

type AppState = {
   user: User;
   theme: "light" | "dark";
};

type AppContextType = {
   state: AppState;
   setUser: (user: User) => void;
   setTheme: (theme: "light" | "dark") => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
   const [state, setState] = useState<AppState>({
      user: { name: "", email: "" },
      theme: "light",
   });

   const setUser = (user: User) => setState((prev) => ({ ...prev, user }));
   const setTheme = (theme: "light" | "dark") =>
      setState((prev) => ({ ...prev, theme }));

   return (
      <AppContext.Provider value={{ state, setUser, setTheme }}>
         {children}
      </AppContext.Provider>
   );
}

export function useAppContext() {
   const context = useContext(AppContext);
   if (context === undefined) {
      throw new Error("useAppContext must be used within an AppProvider");
   }
   return context;
}
