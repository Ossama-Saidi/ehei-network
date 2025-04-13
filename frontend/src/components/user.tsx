"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';
export function User() {

  const router = useRouter();
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
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
  );
}
