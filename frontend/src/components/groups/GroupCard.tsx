// components/groups/GroupCard.tsx
'use client'
import { Users, Info } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  photoUrl?: string;
  bannerUrl?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  onViewDetails: (e: React.MouseEvent) => void;
}

export function GroupCard({ group, onClick, onViewDetails }: GroupCardProps) {
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer ${
        group.status === 'ARCHIVED' ? 'opacity-70' : ''
      }`}
    >
      {/* Group banner/image */}
      <div 
        className="h-32 bg-gray-200" 
        style={{
          backgroundImage: group.bannerUrl ? `url(${group.bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={onClick}
      >
        {group.status === 'ARCHIVED' && (
          <div className="bg-black/50 text-white text-sm font-medium py-1 px-3 inline-block m-2 rounded">
            Archived
          </div>
        )}
      </div>
      
      {/* Group info */}
      <div className="p-4" onClick={onClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 truncate">{group.name}</h3>
          <button 
            onClick={onViewDetails}
            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
            aria-label="View group details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {group.description}
        </p>
        
        <div className="flex items-center mt-4 text-gray-500 text-xs">
          <Users className="h-4 w-4 mr-1" />
          <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}