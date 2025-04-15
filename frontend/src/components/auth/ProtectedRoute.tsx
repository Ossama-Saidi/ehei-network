// src/components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/authUtils';
import { toast } from 'sonner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      router.push('/login');
    }
  }, [router]);

    // During server-side rendering and initial mount, render a placeholder with same structure
    if (!mounted) {
        return <div className="flex flex-col max-h-screen">{/* Placeholder */}</div>;
    }

    // Only apply authentication redirect logic after component is mounted on the client
    if (mounted && !isAuthenticated()) {
        return <div className="flex flex-col max-h-screen">{/* Auth redirect placeholder */}</div>;
    }

  return <>{children}</>;
}