import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ groupId }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [groupId]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/invitations`, {
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
      
      // Update the list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('Error canceling invitation:', error);
      alert('Failed to cancel invitation');
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <h3 className="font-medium mb-4">Pending Invitations</h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : invitations.length > 0 ? (
          <div className="divide-y">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {invitation.user?.avatar ? (
                      <img
                        src={invitation.user.avatar}
                        alt={invitation.user?.username || `User ${invitation.userId}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">
                        {(invitation.user?.name || invitation.user?.username || `User ${invitation.userId}`).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {invitation.user?.name || invitation.user?.username || `User ${invitation.userId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Invited {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelInvitation(invitation.id)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending invitations</p>
          </div>
        )}
      </div>
    </div>
  );
};
