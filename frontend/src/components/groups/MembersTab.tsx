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
  currentUserId: number;
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

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members/${userId}`, {
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/members`, {
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
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4 p-4">
        <h3 className="font-medium">Group Members</h3>
        {(isAdmin || isModerator) && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Invite User
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : members.length > 0 ? (
        <div className="divide-y">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {member.user?.avatar ? (
                    <img
                      src={member.user.avatar}
                      alt={member.user?.username || `User ${member.userId}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">
                      {(member.user?.name || member.user?.username || `User ${member.userId}`).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {member.user?.name || member.user?.username || `User ${member.userId}`}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="capitalize">{member.role.toLowerCase()}</span>
                    <span className="mx-1">•</span>
                    <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {((isAdmin && member.userId !== currentUserId) || 
                (isModerator && member.role !== 'ADMIN' && member.role !== 'MODERATOR' && member.userId !== currentUserId)) && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {isAdmin && member.role === 'MODERATOR' && (
                      <DropdownMenuItem onClick={() => handleDemoteToMember(member.id)}>
                        Demote to Member
                      </DropdownMenuItem>
                    )}
                    {isAdmin && member.role === 'MEMBER' && (
                      <DropdownMenuItem onClick={() => handlePromoteToModerator(member.id)}>
                        Promote to Moderator
                      </DropdownMenuItem>
                    )}
                    {(isAdmin || isModerator) && (
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.userId)}>
                        Remove Member
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-6">No members found.</div>
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
