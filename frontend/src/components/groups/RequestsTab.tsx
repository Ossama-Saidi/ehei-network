// components/groups/RequestsTab.tsx
import { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { getAuthToken } from '@/utils/authUtils';

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
  onRequestUpdate?: () => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({ groupId, onRequestUpdate }) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [groupId]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/${groupId}/requests/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3002/groups/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: action === 'accept' ? 'ACCEPTED' : 'REJECTED'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }
      
      // Update the requests list
      setRequests(requests.filter(req => req.id !== requestId));
      
      // Notify parent component if needed
      if (onRequestUpdate) {
        onRequestUpdate();
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Join Requests ({requests.length})</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : requests.length > 0 ? (
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {request.user?.avatar ? (
                    <img
                      src={request.user.avatar}
                      alt={request.user?.name || `User ${request.userId}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {(request.user?.name || `U`).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">
                    {request.user?.name || `User ${request.userId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequest(request.id, 'accept')}
                  className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  title="Accept request"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRequest(request.id, 'reject')}
                  className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  title="Reject request"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No pending requests
        </div>
      )}
    </div>
  );
};
