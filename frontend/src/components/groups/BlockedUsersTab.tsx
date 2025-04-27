// components/groups/BlockedUsersTab.tsx
import { useState, useEffect } from 'react';
import { Loader2, UserX } from 'lucide-react';
import { getAuthToken } from '@/utils/authUtils';

interface BlockedUser {
  id: number;
  userId: number;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

interface BlockedUsersTabProps {
  groupId: number;
  onUpdateBlocked?: () => void;
}

export const BlockedUsersTab: React.FC<BlockedUsersTabProps> = ({ 
  groupId,
  onUpdateBlocked 
}) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, [groupId]);

  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/blocked`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blocked users');
      }
      
      const data = await response.json();
      setBlockedUsers(data);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setError('Failed to load blocked users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    if (!confirm('Are you sure you want to unblock this user?')) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/block/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to unblock user');
      }
      
      // Update the list
      setBlockedUsers(blockedUsers.filter(user => user.userId !== userId));
      
      // Notify parent component if needed
      if (onUpdateBlocked) {
        onUpdateBlocked();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <UserX className="h-5 w-5 text-gray-500" />
          Blocked Users ({blockedUsers.length})
        </h3>
      </div>

      {error ? (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchBlockedUsers}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : blockedUsers.length > 0 ? (
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {blockedUsers.map((blockedUser) => (
            <div 
              key={blockedUser.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {blockedUser.user?.avatar ? (
                    <img
                      src={blockedUser.user.avatar}
                      alt={blockedUser.user?.username || `User ${blockedUser.userId}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">
                      {(blockedUser.user?.name || blockedUser.user?.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">
                    {blockedUser.user?.name || blockedUser.user?.username || `User ${blockedUser.userId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Blocked {new Date(blockedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleUnblockUser(blockedUser.userId)}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No blocked users</p>
        </div>
      )}
    </div>
  );
};