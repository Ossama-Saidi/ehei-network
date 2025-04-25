// Barre latérale gauche
// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDecodedToken, DecodedToken, getAuthToken, removeAuthToken } from '@/utils/authUtils';

import { Home, User, Users, Bookmark, MessageCircle, Settings, Calendar, FileText, PlusCircle, User2, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import router from 'next/router';
interface UserProfile {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  bio?: string;
  profilePhoto?: string;
  bannerPhoto?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  followers?: number;
  following?: number;
}
export default function Sidebar() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const tokenData = getDecodedToken();
    setUser(tokenData);
  }, []);
  // Fetch user profile data when component mounts
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const token = getAuthToken();
          if (!token) {
            router.push('/login');
            return;
          }
          const response = await fetch('http://localhost:3001/user/profil', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            if (response.status === 401) {
              removeAuthToken();
              router.push('/login');
              return;
            }
            throw new Error('Failed to fetch user profile');
          }
  
          const result = await response.json();
  
          if (!result.success || !result.data) {
            throw new Error('User data not found');
          }
  
          setUserData(result.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile();
    }, [router]);
    const isAdmin = user?.role === 'ADMINISTRATEUR';
  return (
    <div className="space-y-4">
      {/* Carte de profil */}
      <Card className="overflow-hidden">
        {/* Image de couverture */}
        <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-200 relative">
          {/* <div className="text-xs text-white absolute bottom-1 right-2">
            better things are coming
          </div> */}
        </div>
        
        {/* Informations de profil */}
        <CardContent className="p-0">
          {/* Avatar avec bouton d'ajout */}
          <div className="relative flex justify-center mt-[-24px]">
            <Avatar className="h-12 w-12 border-2 border-white bg-gray-300">
              <div className="h-full w-full rounded-full flex items-center justify-center text-gray-500">
              {user?.prenom?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            </Avatar>
            <div className="absolute bottom-[-5px] right-[calc(50%-10px)]">
              <Button size="icon" variant="default" className="h-5 w-5 rounded-full p-0">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Nom et titre */}
          <div className="text-center px-4 pt-2 pb-4">
            <h3 className="font-semibold text-lg">{user?.nomComplet ?? 'Utilisateur'}</h3>
            <p className="text-xs text-gray-600 mt-1">{userData?.bio || 'No bio provided yet.'}</p>
          </div>
        </CardContent>
      </Card>

    <aside className="bg-white rounded-2xl shadow-xl p-4">
      <nav className="space-y-2">
        {/* Accueil */}
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded font-semibold">
          <Home className="h-5 w-5" />
          <span>Accueil</span>
        </Link>
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded font-semibold"
          >
            <FileText className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        )}
        {/* Amis */}
        <div className="flex items-center space-x-2 p-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed select-none">
          <User className="h-5 w-5" />
          <span>Amis</span>
        </div>


        {/* Groups */}
        <Link href="/groups" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded font-semibold">
          <Users className="h-5 w-5" />
          <span>Groups</span>
        </Link>

        {/* Enregistrés */}
        <Link href="/saved" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded font-semibold">
          <Bookmark className="h-5 w-5" />
          <span>Enregistrés</span>
        </Link>

        {/* Messages */}
        {/* <Link href="/chat" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <MessageCircle className="h-5 w-5" />
          <span>Messages</span>
        </Link> */}

        {/* Paramètres */}
        <div className="flex items-center space-x-2 p-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed select-none">
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </div>
      </nav>
      {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
    </aside>
    </div>
  );
}