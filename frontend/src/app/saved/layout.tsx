import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ScrollArea } from "@/components/ui/scroll-area"
export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div className="flex flex-col h-screen">
        <Header className="w-full sticky top-0 z-50" />
        <div className="bg-gray-100 flex flex-col md:flex-row flex-1 px-2 md:px-8 lg:px-16 pt-4 overflow-hidden">
            {/* Sidebar - Cachée sur mobile, visible à partir des tablettes */}
            <div className="hidden md:block md:w-1/5 sticky h-[calc(100vh-60px)] overflow-y-auto">
            <Sidebar />
            </div>
            {/* Feed - Pleine largeur sur mobile, 3/5 sur grands écrans */}
            <ScrollArea className="rounded-md w-full md:w-4/5 px-0 md:px-4">
                {children}
            </ScrollArea>
        </div>
        </div>
  );
}