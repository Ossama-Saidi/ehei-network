// GroupContent.tsx
// This component is responsible for displaying the content of a group.
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Settings, MessageSquare, Shield, ShieldCheck } from 'lucide-react';
import { getAuthToken } from '@/utils/authUtils';

const API_URL = 'http://localhost:3002';

interface GroupContentProps {
  group: {
    id: number;
    name: string;
    description: string;
    privacy: 'PUBLIC' | 'PRIVATE';
    status: string;
    createdAt: string;
    memberCount: number;
    createdBy: number;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Extended interfaces for member data
interface Member {
  userId: number;
  groupId: number;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  // Fields from user service
  data?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export function GroupContent({ group, activeTab, setActiveTab }: GroupContentProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    members: false,
    posts: false,
    events: false,
    files: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data for the active tab
    if (activeTab) {
      fetchTabData(activeTab);
    }
  }, [activeTab, group.id]);

  const fetchTabData = async (tab: string) => {
    const token = getAuthToken();
    if (!token) return;

    // Set loading state for the specific tab
    setLoading(prev => ({ ...prev, [tab]: true }));
    setError(null);

    try {
      let endpoint = '';
      
      switch (tab) {
        case 'members':
          endpoint = `/groups/${group.id}/members`;
          break;
        case 'posts':
          endpoint = `/groups/${group.id}/posts`;
          break;
        case 'events':
          endpoint = `/groups/${group.id}/events`;
          break;
        case 'files':
          endpoint = `/groups/${group.id}/files`;
          break;
        default:
          // Overview tab doesn't need data fetching
          setLoading(prev => ({ ...prev, [tab]: false }));
          return;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${tab}: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the appropriate state based on the tab
      switch (tab) {
        case 'members':
          // Process member data to ensure name and email are accessible
          const processedMembers = data.map((member: Member) => ({
            ...member,
            // If data comes from user service in a nested 'data' property
            name: member.name || (member.data?.firstName && member.data?.lastName ? 
                   `${member.data.firstName} ${member.data.lastName}` : 
                   member.data?.email?.split('@')[0] || 'Unknown'),
            email: member.email || member.data?.email || 'No email provided'
          }));
          setMembers(processedMembers);
          break;
        case 'posts':
          setPosts(data);
          break;
        case 'events':
          setEvents(data);
          break;
        case 'files':
          setFiles(data);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
      setError(`Failed to load ${tab}`);
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'overview' && 
        ((tab === 'members' && members.length === 0) || 
         (tab === 'posts' && posts.length === 0) || 
         (tab === 'events' && events.length === 0) || 
         (tab === 'files' && files.length === 0))) {
      fetchTabData(tab);
    }
  };

  // Function to get specific member types
  const getAdmins = () => members.filter(member => member.role === 'ADMIN');
  const getModerators = () => members.filter(member => member.role === 'MODERATOR');
  const getRegularMembers = () => members.filter(member => member.role === 'MEMBER');

  // Helper to get user display name
  const getUserDisplayName = (member: Member) => {
    // Try to get name from various possible locations in the object
    if (member.name) return member.name;
    if (member.data?.firstName && member.data?.lastName) {
      return `${member.data.firstName} ${member.data.lastName}`;
    }
    if (member.data?.email) {
      return member.data.email.split('@')[0]; // Use part before @ as fallback name
    }
    return 'Unknown User';
  };

  // Helper to get user email
  const getUserEmail = (member: Member) => {
    return member.email || member.data?.email || 'No email provided';
  };

  // Helper to get user avatar URL
  const getUserAvatar = (member: Member) => {
    return member.avatarUrl || member.data?.avatarUrl;
  };

  // Refactored renderMembers to show role-based sections with improved data handling
  const renderMembers = () => {
    if (members.length === 0) {
      return <p className="text-gray-500">No members found.</p>;
    }
    
    const admins = getAdmins();
    const moderators = getModerators();
    const regularMembers = getRegularMembers();
    
    return (
      <div className="space-y-6">
        {/* Admins Section */}
        <div>
          <h3 className="font-semibold text-lg flex items-center mb-3">
            <Shield className="h-5 w-5 text-yellow-500 mr-2" />
            Administrators ({admins.length})
          </h3>
          <div className="space-y-3">
            {admins.length > 0 ? admins.map((admin) => (
              <div key={`admin-${admin.userId}`} className="flex items-center p-3 border rounded-lg bg-white shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-600 font-semibold">
                  {getUserAvatar(admin) ? (
                    <img 
                      src={getUserAvatar(admin)} 
                      alt={getUserDisplayName(admin)} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : getUserDisplayName(admin).charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{getUserDisplayName(admin)}</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">{getUserEmail(admin)}</p>
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Admin</span>
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-500">No administrators found.</p>}
          </div>
        </div>
        
        {/* Moderators Section */}
        <div>
          <h3 className="font-semibold text-lg flex items-center mb-3">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
            Moderators ({moderators.length})
          </h3>
          <div className="space-y-3">
            {moderators.length > 0 ? moderators.map((moderator) => (
              <div key={`mod-${moderator.userId}`} className="flex items-center p-3 border rounded-lg bg-white shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-600 font-semibold">
                  {getUserAvatar(moderator) ? (
                    <img 
                      src={getUserAvatar(moderator)} 
                      alt={getUserDisplayName(moderator)} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : getUserDisplayName(moderator).charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{getUserDisplayName(moderator)}</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">{getUserEmail(moderator)}</p>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Moderator</span>
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-500">No moderators found.</p>}
          </div>
        </div>
        
        {/* Regular Members Section */}
        <div>
          <h3 className="font-semibold text-lg flex items-center mb-3">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Members ({regularMembers.length})
          </h3>
          <div className="space-y-3">
            {regularMembers.length > 0 ? regularMembers.map((member) => (
              <div key={`member-${member.userId}`} className="flex items-center p-3 border rounded-lg bg-white shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-600 font-semibold">
                  {getUserAvatar(member) ? (
                    <img 
                      src={getUserAvatar(member)} 
                      alt={getUserDisplayName(member)} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : getUserDisplayName(member).charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{getUserDisplayName(member)}</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">{getUserEmail(member)}</p>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Member</span>
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-500">No regular members found.</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    if (posts.length === 0) {
      return <p className="text-gray-500">No posts found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id || `post-${post.createdAt}`} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-gray-600 font-semibold">
                {post.author?.avatarUrl ? (
                  <img 
                    src={post.author.avatarUrl} 
                    alt={post.author.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (post.author?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{post.author?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <p className="text-gray-800">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-3">
                <img src={post.imageUrl} alt="Post attachment" className="rounded-lg max-h-64 w-auto" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEvents = () => {
    if (events.length === 0) {
      return <p className="text-gray-500">No events found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id || `event-${event.startDate}`} className="p-4 border rounded-lg bg-white">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 p-2 rounded mr-3 text-center min-w-12">
                <div className="text-xs">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</div>
                <div className="text-xl font-bold">{new Date(event.startDate).getDate()}</div>
              </div>
              <div>
                <h3 className="font-medium text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="mt-2 text-gray-700">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFiles = () => {
    if (files.length === 0) {
      return <p className="text-gray-500">No files found.</p>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={file.id || `file-${index}`} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium truncate">{file.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'}</p>
            <p className="text-xs text-gray-400 mt-2">Uploaded {formatDate(file.createdAt)}</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
              Download
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Group Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Group name"
                defaultValue={group.name}
                disabled={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
              <select 
                className="w-full p-2 border rounded-md bg-white"
                defaultValue={group.privacy}
                disabled={true}
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Group description"
              defaultValue={group.description}
              disabled={true}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Membership Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approveMembers"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                disabled={true}
              />
              <label htmlFor="approveMembers" className="ml-2 block text-sm text-gray-700">
                Require admin approval for new members
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="postApproval"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                disabled={true}
              />
              <label htmlFor="postApproval" className="ml-2 block text-sm text-gray-700">
                Require admin approval for new posts
              </label>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 italic">Only group administrators can edit these settings.</p>
      </div>
    );
  };

  // Array of tab items for the navigation
  const tabItems = [
    { id: 'overview', label: 'Overview', icon: null },
    { id: 'posts', label: 'Posts', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
    { id: 'members', label: 'Members', icon: <Users className="mr-2 h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { id: 'files', label: 'Files', icon: <FileText className="mr-2 h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="mr-2 h-4 w-4" /> }
  ];

  return (
    <div className="mt-6 mb-12">
      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm flex overflow-x-auto">
        {tabItems.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 flex items-center ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold">About {group.name}</h2>
            <div className="flex items-center gap-2 mt-1 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                group.privacy === 'PUBLIC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {group.privacy}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                group.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {group.status}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">Created on {formatDate(group.createdAt)}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-gray-600 mt-2">{group.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { 
                    id: 'members', 
                    icon: <Users className="h-6 w-6 text-blue-500 mr-2" />, 
                    label: 'Members', 
                    value: group.memberCount,
                    color: 'text-blue-500'
                  },
                  { 
                    id: 'posts', 
                    icon: <MessageSquare className="h-6 w-6 text-green-500 mr-2" />, 
                    label: 'Posts', 
                    value: posts.length || 0,
                    color: 'text-green-500'
                  },
                  { 
                    id: 'events', 
                    icon: <Calendar className="h-6 w-6 text-purple-500 mr-2" />, 
                    label: 'Upcoming Events', 
                    value: events.length || 0,
                    color: 'text-purple-500'
                  }
                ].map((stat) => (
                  <div key={stat.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      {stat.icon}
                      <h3 className="font-medium">{stat.label}</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <h2 className="text-xl font-bold mb-1">Posts</h2>
            <p className="text-gray-500 text-sm mb-4">All posts shared in this group</p>
            {loading.posts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              renderPosts()
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h2 className="text-xl font-bold mb-1">Members ({group.memberCount})</h2>
            <p className="text-gray-500 text-sm mb-4">People who are part of this group</p>
            {loading.members ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              renderMembers()
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h2 className="text-xl font-bold mb-1">Events</h2>
            <p className="text-gray-500 text-sm mb-4">Upcoming and past events for this group</p>
            {loading.events ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              renderEvents()
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h2 className="text-xl font-bold mb-1">Files</h2>
            <p className="text-gray-500 text-sm mb-4">Documents and files shared in this group</p>
            {loading.files ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              renderFiles()
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold mb-1">Group Settings</h2>
            <p className="text-gray-500 text-sm mb-4">Manage group settings and permissions</p>
            {renderSettings()}
          </div>
        )}
      </div>
    </div>
  );
}