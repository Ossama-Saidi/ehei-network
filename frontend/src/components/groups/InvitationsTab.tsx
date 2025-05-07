import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { getAuthToken } from '@/utils/authUtils';

interface Invitation {
  id: number;
  userId: number;
  groupId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
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

interface InvitationsTabProps {
  groupId: number;
  onInvitationUpdate?: () => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ 
  groupId,
  onInvitationUpdate 
}) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [groupId]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/invitations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      
      const data = await response.json();
      setInvitations(data.filter((inv: Invitation) => inv.status === 'PENDING'));
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
      
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      if (onInvitationUpdate) {
        onInvitationUpdate();
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
      alert('Failed to cancel invitation');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">
          Pending Invitations ({invitations.length})
        </h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : invitations.length > 0 ? (
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {invitations.map((invitation) => (
            <div 
              key={invitation.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {invitation.user?.avatar ? (
                    <img
                      src={invitation.user.avatar}
                      alt={invitation.user?.name || `User ${invitation.userId}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {(invitation.user?.name || `U`).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">
                    {invitation.user?.name || invitation.user?.username || `User ${invitation.userId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Invited {new Date(invitation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCancelInvitation(invitation.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Cancel invitation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No pending invitations
        </div>
      )}
    </div>
  );
};
