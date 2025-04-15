"use client";
// import { Button } from '@/components/ui/button';
import { removeAuthToken } from '@/utils/authUtils';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    toast.success('Déconnexion réussie');
    router.push('/login');
  };

  return (
    <>
        <LogOut className="mr-2 h-3 w-3" onClick={handleLogout}/>
        <span>Déconnexion</span>
    </>
  );
}