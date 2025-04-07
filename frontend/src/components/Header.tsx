// src/components/Header.tsx

import React from 'react';

interface HeaderProps {
  className?: string;
}

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Users, Home, User2, UserPlus, ThumbsUp, CircleHelp } from 'lucide-react';
import { User } from './user';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
// import Image from "next/image"
// import { AspectRatio } from "@/components/ui/aspect-ratio"

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`bg-white shadow-sm shadow-gray-500/50 py-2 px-4${className}`}>
      <div className="container mx-auto flex justify-between items-center ">
        {/* Logo + Barre de recherche */}
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/" className="flex items-center">
              <img
              src="/ELogoblue.svg"
              alt="EHEI Connect"
              className="h-12 w-auto"
            />
          </Link>
          {/* Barre de recherche - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Rechercher..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
          {/* Icônes de notification et profil */}
          <div className="flex items-center">
          {/* Mobile search icon */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="bigicon">
                <Bell className="h-12 w-12" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Voici vos dernières notifications
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Liste des notifications */}
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Nouveau message</h4>
                    <p className="text-sm text-muted-foreground">Marie Curie vous a envoyé un message</p>
                    <p className="text-xs text-muted-foreground mt-1">Il y a 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Nouvelle demande d'ami</h4>
                    <p className="text-sm text-muted-foreground">Jean Dupont souhaite se connecter</p>
                    <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Réaction à votre publication</h4>
                    <p className="text-sm text-muted-foreground">3 personnes ont aimé votre photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Hier</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {/* <User /> */}
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>OS</AvatarFallback>
              </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User/>
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleHelp className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
export default Header;