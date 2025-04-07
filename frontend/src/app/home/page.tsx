import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LinkedInHomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation bar */}
      <header className="bg-gradient-to-r from-stone-900 to-sky-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
              src="/ELogoblack.svg"
              alt="EHEI Connect"
              className="h-14 w-auto"
            />
        </Link>          
        </div>
          
          <div className="flex space-x-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
              S'inscrire
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-purple-800">
              S'identifier
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          {/* Left column */}
          <div className="md:w-1/2 md:pr-12">
            <h2 className="text-4xl md:text-5xl text-gray-600 font-light mb-8">
              Bienvenue dans votre communauté professionnelle
            </h2>
            
            <div className="space-y-4 max-w-md">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-6">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)" fill="white">
                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                  </g>
                </svg>
                <span>Continuer avec Google</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2 py-6">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#00a1f1" d="M11.5 4v6H5v4h6.5v6H13v-6h6v-4h-6V4z" />
                </svg>
                <span>Continuer avec Microsoft</span>
              </Button>
              
              <Button variant="outline" className="w-full py-6">
                S'identifier avec une adresse e-mail
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                En cliquant sur Continuer pour vous inscrire ou vous identifier, vous acceptez les{' '}
                <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>,{' '}
                la <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a> et la{' '}
                <a href="#" className="text-blue-600 hover:underline">Politique relative aux cookies</a> de LinkedIn.
              </p>
              
              <p className="text-sm mt-6">
                <span>Nouveau sur LinkedIn? </span>
                <a href="#" className="text-blue-600 hover:underline">S'inscrire</a>
              </p>
            </div>
          </div>
          
          {/* Right column - illustration */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="/api/placeholder/600/450" 
              alt="Personne travaillant sur un ordinateur portable" 
              className="w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkedInHomePage;