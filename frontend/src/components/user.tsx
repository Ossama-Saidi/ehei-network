"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DecodedToken, getDecodedToken } from '@/utils/authUtils';
export function User() {

  const [user, setUser] = useState<DecodedToken | null>(null);
    const router = useRouter();
  
      useEffect(() => {
        const tokenData = getDecodedToken();
        setUser(tokenData);
      }, []);
    
    // Get initials for avatar fallback
    const getInitials = () => {
      if (user && user.nom && user.prenom) {
        return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`;
      }
      return 'U'; // Default fallback
    };
    
  const profil = () => {
    router.push('/profil');
  };

  return (
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
          onClick={profil}
        >
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
  );
}
