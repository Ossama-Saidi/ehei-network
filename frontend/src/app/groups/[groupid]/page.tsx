'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { getAuthToken, getDecodedToken } from '@/utils/authUtils';
import { getImageUrl } from '@/utils/imageUtils';
import { GroupInfoCard } from '@/components/groups/GroupInfoCard';
import { GroupContent } from '@/components/groups/GroupContent';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

const API_URL = 'http://localhost:3002';
const DEFAULT_BANNER = '/uploads/banners/banner.png'; // Use the same path as your upload service

interface Group {
  id: number;
  name: string;
  description: string;
  status: string;
  privacy: string;
  createdAt: string;
  bannerUrl: string | null; // Change this from optional to nullable
  memberCount: number;
  createdBy?: number;
}

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupid as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = getDecodedToken();

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, router]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const userInfo = getDecodedToken();
      
      if (!token || !userInfo?.sub) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch group: ${response.status}`);
      }

      const data = await response.json();
      setGroup(data);
      
      // Check membership status with the correct userId from token
      const membershipResponse = await fetch(`${API_URL}/groups/${groupId}/membership/${userInfo.sub}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Parse the response to get the actual membership status
      if (membershipResponse.ok) {
        const membershipData = await membershipResponse.json();
        setIsMember(membershipData.isMember); // Use the actual boolean value from response
      } else {
        setIsMember(false); // If response is not ok, user is not a member
      }

      // Check if current user is admin
      if (userInfo?.sub) {
        const memberResponse = await fetch(
          `${API_URL}/groups/${groupId}/members/${userInfo.sub}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setIsAdmin(memberData.role === 'ADMIN');
        }
      }

    } catch (error) {
      console.error('Error fetching group:', error);
      setError(error instanceof Error ? error.message : 'Failed to load group details');
      setIsMember(false); // Reset membership status on error
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchGroupDetails();
  };

  const handleJoinGroup = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to join group');
      }

      setIsMember(true);
      // Refresh group details to get updated member count
      await fetchGroupDetails();
    } catch (error) {
      console.error('Error joining group:', error);
      setError('Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to leave group');
      }

      setIsMember(false);
      // Refresh group details to get updated member count
      await fetchGroupDetails();
    } catch (error) {
      console.error('Error leaving group:', error);
      setError('Failed to leave group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareGroup = () => {
    // Add share logic here
    console.log('Sharing group...');
  };

  const handleArchiveGroup = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/groups/${groupId}/archive`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to archive group');
      }

      // Refresh group data
      await fetchGroupDetails();
    } catch (error) {
      console.error('Error archiving group:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleActivateGroup = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/groups/${groupId}/active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to activate group');
      }

      // Refresh group data
      await fetchGroupDetails();
    } catch (error) {
      console.error('Error activating group:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading group details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Group not found</h3>
              <p className="text-yellow-700">The group you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section at the top */}
      <div className="relative">
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img 
            src={group.bannerUrl ? getImageUrl(group.bannerUrl) : `${API_URL}${DEFAULT_BANNER}`}
            alt={`${group.name} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load:', e.currentTarget.src);
              e.currentTarget.src = getImageUrl(DEFAULT_BANNER);
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>

      {/* Content below banner with sidebars */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 min-h-[calc(100vh-20rem)] p-4 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4">
            {/* Info Card Component */}
            {group && (
              <GroupInfoCard
                group={group}
                isMember={isMember}
                isAdmin={isAdmin}
                isLoading={isLoading}
                onJoin={handleJoinGroup}
                onLeave={handleLeaveGroup}
                onShare={handleShareGroup}
                onArchive={handleArchiveGroup}
                onActivate={handleActivateGroup}
              />
            )}

            {/* Group Content Component */}
            {group && (
              <GroupContent
                group={{
                  id: group.id,
                  name: group.name,
                  description: group.description,
                  privacy: group.privacy as "PUBLIC" | "PRIVATE",
                  status: group.status,
                  createdAt: group.createdAt,
                  memberCount: group.memberCount,
                  createdBy: group.createdBy ?? 0
                }}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 min-h-[calc(100vh-20rem)] p-4 border-l border-gray-200">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}