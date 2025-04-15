// components/groups/RequestsTab.tsx
import { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';

interface JoinRequest {
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

interface RequestsTabProps {
  groupId: number;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({ groupId }) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [groupId]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      setRequests(data.filter((req: JoinRequest) => req.status === 'PENDING'));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/requests/${requestId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      
      // Update the list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/groups/${groupId}/requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      
      // Update the list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <h3 className="font-medium mb-4">Pending Join Requests</h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : requests.length > 0 ? (
          <div className="divide-y">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {request.user?.avatar ? (
                      <img
                        src={request.user.avatar}
                        alt={request.user?.username || `User ${request.userId}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">
                        {(request.user?.name || request.user?.username || `User ${request.userId}`).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {request.user?.name || request.user?.username || `User ${request.userId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full mr-2"
                    title="Accept"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending requests</p>
          </div>
        )}
      </div>
    </div>
  );
};
