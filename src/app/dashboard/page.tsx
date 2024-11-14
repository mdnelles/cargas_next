// src/app/dashboard/page.tsx
import DashboardGrid from "./dashboard-grid";
import DashboardTemplate from "./dashboard-template";

export default function DashboardPage() {
   return (
      <DashboardTemplate title='Dashboard'>
         <DashboardGrid />
      </DashboardTemplate>
   );
}
