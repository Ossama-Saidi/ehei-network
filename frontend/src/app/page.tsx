// Page d'accueil (home)
// src/app/page.tsx

import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Sidebar from '@/components/Sidebar';
import Feed from '@/components/Feed';
import RightSidebar from '@/components/RightSidebar';
import Header from '@/components/Header';
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Home() {
  return (
    <ProtectedRoute>
    <div className="flex flex-col max-h-screen">
      <Header className="w-full sticky top-0 z-50" />
      <div className="bg-gray-100 flex flex-col md:flex-row flex-1 px-2 md:px-8 lg:px-16 pt-4 pb-16 md:pb-4 overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible from tablet up */}
        <div className="hidden md:block md:w-1/5 lg:w-1/5 sticky h-[calc(100vh-60px)] overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Feed - Full width on mobile, 3/5 (60%) on larger screens */}
        <ScrollArea className="rounded-md w-full md:w-3/5 px-0 md:px-2">
          <main>
            <Feed className="flex-1" />
          </main>
        </ScrollArea>
        
        {/* RightSidebar - Hidden on mobile, visible on desktop */}
        <ScrollArea className="hidden lg:block lg:w-1/5 sticky">
          <RightSidebar className="flex-1 w-full"/>
        </ScrollArea>
      </div>
      
      {/* Mobile Navigation - Uncomment when ready */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-14">
          <button className="p-2"><span className="icon-home">🏠</span></button>
          <button className="p-2"><span className="icon-search">🔍</span></button>
          <button className="p-2"><span className="icon-profile">👤</span></button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}