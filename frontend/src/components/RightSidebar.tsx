// Barre latérale droite
// src/components/RightSidebar.tsx
'use client';

interface RightSidebarProps {
  className?: string;
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Star, 
  PlusCircle, 
  Network,
  Globe,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';
import ChatView from '@/components/ChatView'; // Importation du composant de chat créé précédemment
import { Card, CardContent } from './ui/card';
import { Avatar } from './ui/avatar';


const RightSidebar: React.FC<RightSidebarProps> = ({ className }) => {

  const [showChat, setShowChat] = useState(false);
  const participations = [
      {
        icon: <Users className="h-5 w-5 text-blue-600" />,
        name: "Software Engineers Community",
        type: "Professional Group",
        members: 2500
      },
      {
        icon: <Globe className="h-5 w-5 text-green-600" />,
        name: "Tech Innovators Morocco",
        type: "Regional Network",
        members: 1800
      },
      {
        icon: <BookOpen className="h-5 w-5 text-purple-600" />,
        name: "EHEI Tech Research Club",
        type: "Academic Group",
        members: 120
      },
      {
        icon: <Award className="h-5 w-5 text-orange-600" />,
        name: "Young Entrepreneurs Network",
        type: "Professional Network",
        members: 950
      }
    ];
  const statistics = [
      {
        icon: <Users className="h-5 w-5 text-blue-600" />,
        label: "Profile Views",
        value: "2,345",
        trend: "up"
      },
      {
        icon: <Activity className="h-5 w-5 text-green-600" />,
        label: "Post Interactions",
        value: "456",
        trend: "up"
      },
      {
        icon: <Network className="h-5 w-5 text-purple-600" />,
        label: "Connections",
        value: "187",
        trend: "stable"
      }
    ];
  const suggestedConnections = [
      {
        name: "Ahmed Benali",
        title: "Senior Software Engineer",
        company: "Tech Innovations",
        mutualConnections: 12
      },
      {
        name: "Fatima El Amrani",
        title: "Product Manager",
        company: "Digital Solutions",
        mutualConnections: 8
      },
      {
        name: "Youssef Kadiri",
        title: "AI Research Scientist",
        company: "AI Frontiers Lab",
        mutualConnections: 5
      }
    ];

    
  return (
    <div className="space-y-4 w-full">
      {/* First Card: Statistics (1/5 height) */}
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-gray-600" />
            Profile Stats
          </h4>
          
          <div className="space-y-3">
            {statistics.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {stat.icon}
                  <div>
                    <h5 className="font-medium text-sm">{stat.label}</h5>
                    <p className="text-xs text-gray-500">
                      {stat.value} {stat.trend === 'up' && '↑'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Second Card: Groups and Pages (2/5 height) */}
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          {/* Nom et titre */}
          {/* Groups and Pages Section */}
        <div className="p-4">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-6 w-6 mr-2 text-gray-600" />
            Groups & Pages
          </h4>
          
          <div className="space-y-3">
            {participations.map((group, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {group.icon}
                  <div>
                    <h5 className="font-medium text-sm">{group.name}</h5>
                    <p className="text-xs text-gray-500">{group.type}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  {group.members.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
      {/* Third Card: Suggestions to Follow (2/5 height) */}
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4">
          <h5 className="text-lg font-semibold mb-4 flex items-center">
            Suggestion
          </h5>
          
          <div className="space-y-3">
            {suggestedConnections.map((connection, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {connection.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{connection.name}</h5>
                    <p className="text-xs text-gray-500">
                      {connection.title} at {connection.company}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {connection.mutualConnections} mutual
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
       {/* Bouton de chat fixe en bas à droite */}
       <div className="fixed bottom-2 right-4">
        <Button 
          onClick={() => setShowChat(!showChat)} 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-white shadow-lg border-gray-200"
        >
          <ExternalLink className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Fenêtre de chat (conditionnellement affichée) */}
      {showChat && (
        <div className="fixed bottom-10 right-6 z-50">
          <ChatView />
        </div>
      )}
    </div>
  );
  }
  export default RightSidebar;