import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation bar */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
              src="/vercel.svg"
              alt="EHEI Connect"
              className="h-12 w-auto"
            />
          </Link>         
        </div>
          
          <div className="flex space-x-4">
          <Link href="/login" className="flex items-center">
            <Button variant="ghost" className="text-white text-white hover:bg-white">
              S'identifier
            </Button>
          </Link>
          <Link href="/login" className="flex items-center">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white">
              S'inscrire
            </Button>
          </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          {/* Left column */}
          <div className="md:w-1/2 md:pr-12">
            <h2 className="text-4xl md:text-5xl text-gray-600 font-light mb-12">
              Bienvenue dans votre communauté professionnelle
            </h2>
            <div className="space-y-3 max-w-md">
              <p className="text-gray-500 text-lg mb-4">
              Connectez-vous à votre compte EHEI Connect pour découvrir un monde de possibilités professionnelles.
              </p>
              <Link href="/login" className="flex items-center">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-6">
                <img
                  src="/vercel.svg"
                  alt="EHEI Connect"
                  className="h-4 w-auto"
                />
                <span>Créer un nouveau compte</span>
              </Button></Link>
              <Link href="/login" className="flex items-center">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2 py-6">
                <img
                  src="/ELogoblue.svg"
                  alt="EHEI Connect"
                  className="h-4 w-auto"
                />
                <span>Se conneter</span>
              </Button></Link>
              
              <p className="text-xs text-gray-500 mt-4">
                En cliquant sur Continuer pour vous inscrire ou vous identifier, vous acceptez les{' '}
                <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>,{' '}
                la <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a> et la{' '}
                <a href="#" className="text-blue-600 hover:underline">Politique relative aux cookies</a> de EHEI Connect.
              </p>
              
              <p className="text-sm mt-6">
                <span>Nouveau sur EHEI Connect? </span>
                <a href="#" className="text-blue-600 hover:underline">S'inscrire</a>
              </p>
            </div>
          </div>
          
          {/* Right column - illustration */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="/LogoEheiBlue.svg" 
              alt="Personne travaillant sur un ordinateur portable" 
              className="rounded-full w-full max-w-lg mx-min md:max-w-md lg:max-w-lg xl:max-w-xl"
              style={{ maxHeight: '30vh', objectFit: 'contain' }}
            />
          {/*   <h2 className="mt-4 font-klavika font-bold italic text-center text-5xl bg-gradient-to-r from-blue-950 to-blue-600 bg-clip-text text-transparent">
              EHEI Connect
           </h2> */}
          <h3 className="mt-4 font-klavika font-regular italic text-center text-xl bg-gradient-to-r from-stone-600 to-stone-900 bg-clip-text text-transparent">
            Where Ideas Meet, Friendships Spark, and Futures Begin.
          </h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;