import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function Unauthorized() {
    return (
      <div className="p-10 text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-12 pb-12">Accès refusé</h1>
        <p className="mt-12 text-gray-600">Vous n'avez pas les droits pour accéder à cette page.</p>
        <p className="mt-2 text-gray-600">Veuillez contacter l'administrateur si vous pensez que c'est une erreur.</p>
        <Link href="/home" className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4 text-sm font-medium">
            <LogIn className="w-4 h-4" />
            <Button variant="ghost" className="flex items-center text-blue gap-2">Retour à la page de connexion</Button>
        </Link>
      </div>
    );
  }
  