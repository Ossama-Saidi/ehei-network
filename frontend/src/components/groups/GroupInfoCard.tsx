import { CalendarDays, Users, Lock, Unlock, Archive, RefreshCw, Share2 } from 'lucide-react';

interface Group {
  name: string;
  status: string;
  description: string;
  createdAt: string;
  memberCount: number;
  privacy: string;
}

interface GroupInfoCardProps {
  group: Group;
  isMember: boolean;
  isAdmin: boolean; // Add this prop
  isLoading: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onShare: () => void;
  onArchive: () => void; // Add this prop
  onActivate: () => void; // Add this prop
}

export function GroupInfoCard({ 
  group, 
  isMember,
  isAdmin, 
  isLoading, 
  onJoin, 
  onLeave, 
  onShare,
  onArchive,
  onActivate 
}: GroupInfoCardProps) {
  const renderActionButton = () => {
    if (isLoading) {
      return (
        <button 
          disabled
          className="px-4 py-2 bg-gray-100 text-gray-400 font-medium rounded-md cursor-not-allowed"
        >
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        </button>
      );
    }

    if (isMember) {
      return (
        <button 
          onClick={onLeave}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          Leave Group
        </button>
      );
    }

    return (
      <button 
        onClick={onJoin}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
      >
        <Users className="h-4 w-4 mr-2" />
        Join Group
      </button>
    );
  };

  const renderAdminActions = () => {
    if (!isAdmin) return null;

    return (
      <div className="mt-4 flex space-x-3">
        {group.status === 'ACTIVE' ? (
          <button
            onClick={onArchive}
            className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200 flex items-center"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive Group
          </button>
        ) : (
          <button
            onClick={onActivate}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Activate Group
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{group.name}</h1>
            </div>
            <p className="mt-2 text-gray-600 max-w-2xl">{group.description}</p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              {renderActionButton()}
              <button 
                onClick={onShare}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
            {renderAdminActions()}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{new Date(group.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-white-100 p-2 mr-3">
              {/* <Users className="h-5 w-5 text-green-600" /> */}
            </div>
            <div>
              {/* <p className="text-sm text-gray-500">Members</p>
              <p className="font-medium">{group.memberCount}</p> */}
            </div>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-white-100 p-2 mr-3">
              {/* {group.privacy === 'PUBLIC' ? (
                <Unlock className="h-5 w-5 text-purple-600" />
              ) : (
                <Lock className="h-5 w-5 text-purple-600" />
              )} */}
            </div>
            <div>
              {/* <p className="text-sm text-gray-500">Privacy</p>
              <p className="font-medium">{group.privacy}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}