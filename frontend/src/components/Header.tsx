// src/components/Header.tsx

'use client';

interface HeaderProps {
  className?: string;
}
import { useEffect, useState, useRef } from 'react';
import { getDecodedToken, DecodedToken, getAuthToken, removeAuthToken } from '@/utils/authUtils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Bell, Users, Home, User2, UserPlus, ThumbsUp, CircleHelp } from 'lucide-react';
import { User } from './user';
import SearchBar from './search/SearchBar';
import SearchHistory from './search/SearchHistory';
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
import LogoutButton from './buttons/LogoutButton';
import { useRouter } from 'next/navigation';
import { type SearchHistoryItem } from './search/SearchHistory'; 

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tokenData = getDecodedToken();
    setUser(tokenData);
  }, []);
  
  // Handle clicking outside search area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user && user.nom && user.prenom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`;
    }
    return 'U'; // Default fallback
  };

  const handleSearchHistoryItemClick = (term: string) => {
    // Si tu veux faire quelque chose quand tu cliques sur un historique
    // Exemple : lancer une recherche future
    // setSearchTerm(term);
    // setShowSearchHistory(false);
  };

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
          <div 
            className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4" 
            ref={searchRef}
          >
            <div className="relative w-full">
              <div
                onFocus={() => {
                  setSearchFocused(true);
                  setShowSearchHistory(true);
                }}
                onBlur={() => setSearchFocused(false)}
              >
                <SearchBar />
              </div>
              <SearchHistory
                visible={showSearchHistory && !searchFocused}
                onItemClick={handleSearchHistoryItemClick}
              />
            </div>
          </div>
        </div>
        {/* Icônes de notification et profil */}
        <div className="flex items-center">
          {/* Mobile search Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Rechercher</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <SearchBar />
                <div className="mt-4">
                <SearchHistory
                visible={showSearchHistory && !searchFocused}
                onItemClick={handleSearchHistoryItemClick}
                />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Notifications */}
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
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Avatar>
                  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profil')}>
                <User2 className="mr-2 h-4 w-4" />
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
                <LogoutButton/>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;