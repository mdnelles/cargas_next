import DashboardGrid from "./dashboard-grid";
import TopNav from "./top-nav";

export default function DashboardPage() {
   return (
      <div className='min-h-screen bg-gray-100'>
         <TopNav />
         <main className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
            <DashboardGrid />
         </main>
      </div>
   );
}
