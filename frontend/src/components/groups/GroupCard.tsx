// // components/groups/GroupCard.tsx
// 'use client'
// import { Users, Info, Lock, Unlock } from 'lucide-react';
// import { getImageUrl } from '@/utils/imageUtils';

// interface Group {
//   id: number;
//   name: string;
//   description: string;
//   createdBy: number;
//   bannerUrl?: string;
//   status: 'ACTIVE' | 'ARCHIVED';
//   privacy: 'PUBLIC' | 'PRIVATE';
//   memberCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface GroupCardProps {
//   group: Group;
//   onClick: () => void;
//   onViewDetails: (e: React.MouseEvent) => void;
// }

// export function GroupCard({ group, onClick, onViewDetails }: GroupCardProps) {
//   const handleCardClick = (e: React.MouseEvent) => {
//     // Prevent clicking the card if clicking the details button
//     if (!(e.target as HTMLElement).closest('button')) {
//       onClick();
//     }
//   };

//   return (
//     <div 
//       className={`
//         rounded-lg overflow-hidden shadow-md border border-gray-200 
//         hover:shadow-lg transition-all duration-200 
//         ${group.status === 'ARCHIVED' ? 'opacity-70' : ''}
//         ${group.status === 'ARCHIVED' ? 'grayscale' : ''}
//       `}
//     >
//       {/* Group banner/image */}
//       <div 
//         className="relative h-32 bg-gradient-to-r from-blue-400 to-indigo-500" 
//         style={group.bannerUrl ? {
//           backgroundImage: `url(http://localhost:3002/uploads/banners/${group.bannerUrl})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         } : undefined}
//         onClick={handleCardClick}
//       >
//         <div className="absolute inset-0 bg-black/10" />
        
//         <div className="absolute top-2 left-2 flex gap-2">
//           {group.status === 'ARCHIVED' && (
//             <div className="bg-black/50 text-white text-sm font-medium py-1 px-3 rounded">
//               Archived
//             </div>
//           )}
//           <div className="bg-black/50 text-white text-sm font-medium py-1 px-3 rounded flex items-center gap-1">
//             {group.privacy === 'PRIVATE' ? (
//               <>
//                 <Lock className="h-3 w-3" />
//                 Private
//               </>
//             ) : (
//               <>
//                 <Unlock className="h-3 w-3" />
//                 Public
//               </>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Group info */}
//       <div className="p-4" onClick={handleCardClick}>
//         <div className="flex justify-between items-start">
//           <h3 className="font-bold text-lg text-gray-900 truncate flex-1">
//             {group.name}
//           </h3>
//           <button 
//             onClick={onViewDetails}
//             className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//             aria-label="View group details"
//           >
//             <Info className="h-4 w-4" />
//           </button>
//         </div>
        
//         <p className="text-gray-600 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
//           {group.description || 'No description provided'}
//         </p>
        
//         <div className="flex items-center justify-between mt-4 text-gray-500 text-xs">
//           <div className="flex items-center">
//             <Users className="h-4 w-4 mr-1" />
//             <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
//           </div>
//           <span className="text-gray-400">
//             Created {new Date(group.createdAt).toLocaleDateString()}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/groups/GroupCard.tsx
'use client'
import { Users, Info, Lock, Unlock } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';

// Define constants similar to the group detail page
const API_URL = 'http://localhost:3002';
const DEFAULT_BANNER = '/uploads/banners/banner.png';

interface Group {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  bannerUrl?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  privacy: 'PUBLIC' | 'PRIVATE';
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  onViewDetails: (e: React.MouseEvent) => void;
}

export function GroupCard({ group, onClick, onViewDetails }: GroupCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent clicking the card if clicking the details button
    if (!(e.target as HTMLElement).closest('button')) {
      onClick();
    }
  };

  return (
    <div 
      className={`
        rounded-lg overflow-hidden shadow-md border border-gray-200 
        hover:shadow-lg transition-all duration-200 
        ${group.status === 'ARCHIVED' ? 'opacity-70' : ''}
        ${group.status === 'ARCHIVED' ? 'grayscale' : ''}
      `}
    >
      {/* Group banner/image using the same approach as [groupid] page */}
      <div 
        className="relative h-32 bg-gradient-to-r from-blue-400 to-indigo-500" 
        onClick={handleCardClick}
      >
        <img 
          src={group.bannerUrl ? getImageUrl(group.bannerUrl) : `${API_URL}${DEFAULT_BANNER}`}
          alt={`${group.name} banner`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load:', e.currentTarget.src);
            e.currentTarget.src = getImageUrl(DEFAULT_BANNER);
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="absolute top-2 left-2 flex gap-2">
          {group.status === 'ARCHIVED' && (
            <div className="bg-black/50 text-white text-sm font-medium py-1 px-3 rounded">
              Archived
            </div>
          )}
          <div className="bg-black/50 text-white text-sm font-medium py-1 px-3 rounded flex items-center gap-1">
            {group.privacy === 'PRIVATE' ? (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3" />
                Public
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Group info */}
      <div className="p-4" onClick={handleCardClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 truncate flex-1">
            {group.name}
          </h3>
          <button 
            onClick={onViewDetails}
            className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="View group details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          {group.description || 'No description provided'}
        </p>
        
        <div className="flex items-center justify-between mt-4 text-gray-500 text-xs">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
          </div>
          <span className="text-gray-400">
            Created {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}