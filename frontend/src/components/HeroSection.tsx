// src/components/HeroSection.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur Notre communaité EHEI-Connect
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Partagez, connectez-vous et découvrez du contenu passionnant.
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Commencer maintenant
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}