// components/groups/BlockedUsersTab.tsx
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
}

export const BlockedUsersTab: React.FC<BlockedUsersTabProps> = ({ groupId }) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, [groupId]);

  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/blocked`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/blocked/${userId}`, {
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
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <h3 className="font-medium mb-4">Blocked Users</h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : blockedUsers.length > 0 ? (
          <div className="divide-y">
            {blockedUsers.map((blockedUser) => (
              <div key={blockedUser.id} className="flex items-center justify-between py-3">
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
                        {(blockedUser.user?.name || blockedUser.user?.username || `User ${blockedUser.userId}`).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {blockedUser.user?.name || blockedUser.user?.username || `User ${blockedUser.userId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Blocked {new Date(blockedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblockUser(blockedUser.userId)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No blocked users</p>
          </div>
        )}
      </div>
    </div>
  );
};