'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, Users, Lock, Unlock, ChevronLeft, RefreshCw } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  description: string;
  status: string;
  privacy: string;
  createdAt: string;
  bannerUrl?: string;
  memberCount: number;
}

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupid as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`http://localhost:3002/groups/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch group: ${response.statusText}`);
        }

        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load group details');
      } finally {
        setLoading(false);
      }
    }

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, router]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`http://localhost:3002/groups/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch group: ${response.statusText}`);
        }

        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetails();
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
      {/* Banner with sticky header */}
      <div className="relative">
        <div className="w-full h-64 md:h-80 overflow-hidden">
          {group.bannerUrl ? (
            <img 
              src={group.bannerUrl} 
              alt={`${group.name} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{group.name}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Group info card - overlapping the banner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 sm:-mt-16">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{group.name}</h1>
                    <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      group.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 max-w-2xl">{group.description}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                    Join Group
                  </button>
                  <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 transition">
                    Share
                  </button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-2 mr-3">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(group.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="font-medium">{group.memberCount}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-2 mr-3">
                    {group.privacy === 'PUBLIC' ? (
                      <Unlock className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Privacy</p>
                    <p className="font-medium">{group.privacy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <Link 
              href={`/groups/${group.id}`}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Link>
            <Link 
              href={`/groups/${group.id}/members`}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </Link>
            <Link 
              href={`/groups/${group.id}/feed`}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feed' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </Link>
            <Link 
              href={`/groups/${group.id}/events`}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </Link>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Group Overview</h2>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">About this group</h3>
                  <p className="text-gray-600">
                    {group.description || "This group hasn't provided a detailed description yet."}
                  </p>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-gray-500 italic">No recent activity to display.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Top Members</h3>
                  <div className="space-y-4">
                    <p className="text-gray-500 italic">Member information will appear here.</p>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Upcoming Events</h4>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-gray-500 italic">No upcoming events.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}