// Barre latérale gauche
// src/components/Sidebar.tsx
import Link from 'next/link';
import { Home, User, Users, Bookmark, MessageCircle, Settings, Calendar, FileText, PlusCircle, User2, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function Sidebar() {
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
                <span className="text-2xl">O</span>
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
            <h3 className="font-semibold text-lg">Ossama Saidi</h3>
            <p className="text-xs text-gray-600 mt-1">
              4th-Year Software Engineering Student | Aspiring Software...
            </p>
            <p className="text-xs text-gray-600 mt-1">
            📍 Nador Province, Oriental
            </p>
            <div className="flex items-center justify-center text-xs text-gray-600 mt-1">
              <span className="flex items-center">
                {/* <img src="/api/placeholder/16/16" alt="EHEI" className="h-4 w-4 mr-1" /> */}
                🎓 EHEI Oujda
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

    <aside className="bg-white rounded-2xl shadow-xl p-4">
      <nav className="space-y-2">
        {/* Accueil */}
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <Home className="h-5 w-5" />
          <span>Accueil</span>
        </Link>

        {/* Amis */}
        <Link href="/friends" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <User className="h-5 w-5" />
          <span>Amis</span>
        </Link>

        {/* Groups */}
        <Link href="/groups" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <Users className="h-5 w-5" />
          <span>Groups</span>
        </Link>

        {/* Enregistrés */}
        <Link href="/saved" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <Bookmark className="h-5 w-5" />
          <span>Enregistrés</span>
        </Link>

        {/* Messages */}
        {/* <Link href="/chat" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <MessageCircle className="h-5 w-5" />
          <span>Messages</span>
        </Link> */}

        {/* Paramètres */}
        <Link href="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Link>
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