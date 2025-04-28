// app/groups/page.tsx - Main Groups Page
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GroupCard } from '@/components/groups/GroupCard';
import { getImageUrl } from '@/utils/imageUtils'; // Add this import
import { Loader2, Plus, Search } from 'lucide-react';
import { getAuthToken, getDecodedToken } from '@/utils/authUtils';
import { BlockedUsersTab } from '@/components/groups/BlockedUsersTab';
import { InvitationsTab } from '@/components/groups/InvitationsTab';
import { MembersTab } from '@/components/groups/MembersTab';
import { RequestsTab } from '@/components/groups/RequestsTab';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';


// Define API URL constant like in the [groupid] page
const API_URL = 'http://localhost:3002';
const DEFAULT_BANNER = '/uploads/banners/banner.png';


interface Group {
  id: number;
  name: string;
  privacy: 'PUBLIC' | 'PRIVATE';  // Required property that was missing
  memberCount: number;            // Required property that was missing
  description: string;
  createdBy: number;
  bannerUrl?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  nomComplet: string;
  nom: string;
  prenom: string;
  bio?: string;
  badge?: string;
  telephone?: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:3002/groups', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON response
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server returned status ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:3002/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch group details: ${response.status}`);
      }

      const data = await response.json();
      
      // Update relevant state based on the fetched data
      setIsAdmin(data.isAdmin || false);
      setIsModerator(data.isModerator || false);
      
      // Refresh the groups list to reflect any changes
      fetchGroups();
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch group details');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchGroups();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:3002/groups?name=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON response
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server returned status ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error searching groups:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (group: Group) => {
    setGroupId(group.id);
  };

  const decodedToken = getDecodedToken();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Banner Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Groups</h1>
        </div>
      </div>

      {/* Content Area with Sidebars */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 min-h-[calc(100vh-8rem)] p-4 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Top Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-2xl">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Search
                  </button>
                </div>
              </div>
              <button
                onClick={() => router.push('/groups/create')}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Group
              </button>
            </div>

            {/* Groups Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
                <button 
                  onClick={fetchGroups} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => router.push(`/groups/${group.id}`)}
                    onViewDetails={() => handleViewDetails(group)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No groups found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 min-h-[calc(100vh-8rem)] p-4 border-l border-gray-200">
          <RightSidebar />
          {/* Group Details Tabs */}
          {groupId && (
            <div className="mt-6 space-y-6">
              <MembersTab
                groupId={groupId}
                isAdmin={isAdmin}
                isModerator={isModerator}
                currentUserId={decodedToken?.sub ?? null}
              />
              
              {(isAdmin || isModerator) && (
                <>
                  <RequestsTab
                    groupId={groupId}
                    onRequestUpdate={fetchGroupDetails}
                  />
                  <InvitationsTab
                    groupId={groupId}
                    onInvitationUpdate={fetchGroupDetails}
                  />
                  <BlockedUsersTab
                    groupId={groupId}
                    onUpdateBlocked={fetchGroupDetails}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}