// components/groups/MembersTab.tsx
import { useState, useEffect } from 'react';
import { Loader2, UserPlus, MoreHorizontal } from 'lucide-react';
import { InviteUserModal } from './InviteUserModal';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { getAuthToken, DecodedToken } from '@/utils/authUtils';

interface Member {
  id: number;
  userId: number;
  groupId: number;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
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

interface MembersTabProps {
  groupId: number;
  isAdmin: boolean;
  isModerator: boolean;
  currentUserId: number | null;
}

export const MembersTab: React.FC<MembersTabProps> = ({ 
  groupId, 
  isAdmin, 
  isModerator,
  currentUserId
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
      
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  const handlePromoteToModerator = async (memberId: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/members`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: memberId,
          role: 'MODERATOR'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to promote member');
      }
      
      fetchMembers();
    } catch (error) {
      console.error('Error promoting member:', error);
      alert('Failed to promote member');
    }
  };

  const handleDemoteToMember = async (memberId: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/members`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: memberId,
          role: 'MEMBER'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to demote member');
      }
      
      fetchMembers();
    } catch (error) {
      console.error('Error demoting member:', error);
      alert('Failed to demote member');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-lg">Members ({members.length})</h3>
        {isAdmin && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Invite
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : members.length > 0 ? (
        <div className="divide-y max-h-[500px] overflow-y-auto">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {member.user?.avatar ? (
                    <img
                      src={member.user.avatar}
                      alt={member.user?.name || `User ${member.userId}`}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {(member.user?.name || `U`).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">
                    {member.user?.name || `User ${member.userId}`}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {member.role.toLowerCase()}
                  </p>
                </div>
              </div>

              {((isAdmin && currentUserId && member.userId !== currentUserId) || 
                (isModerator && member.role === 'MEMBER')) && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {isAdmin && member.role !== 'ADMIN' && (
                      <>
                        {member.role === 'MEMBER' ? (
                          <DropdownMenuItem onClick={() => handlePromoteToModerator(member.id)}>
                            Promote to Moderator
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleDemoteToMember(member.id)}>
                            Demote to Member
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-red-600"
                    >
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-6">
          No members found
        </div>
      )}

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupId={groupId}
        onInvite={fetchMembers}
      />
    </div>
  );
};
