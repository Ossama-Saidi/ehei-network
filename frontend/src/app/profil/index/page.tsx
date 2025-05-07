'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit2, MessageCircle, Users, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import Feed from '@/components/groups/Feed';
import { getAuthToken, removeAuthToken } from '@/utils/authUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserProfile {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  bio?: string;
  profilePhoto?: string;
  bannerPhoto?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
  followers?: number;
  following?: number;
}

export default function ProfileIndex() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/user/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            removeAuthToken();
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error('User data not found');
        }

        setUserData(result.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (userData && userData.nom && userData.prenom) {
      return `${userData.prenom.charAt(0)}${userData.nom.charAt(0)}`;
    }
    return 'U'; // Default fallback
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
        <p className="text-lg font-medium text-gray-700">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white mb-20">
  <div className="flex-1 flex flex-col mb-20">
    {/* Profile Header */}
    <div className="relative w-full">
      {/* Banner */}
      <div className="w-full h-24 sm:h-64 md:h-40 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-200">
        {userData?.bannerPhoto ? (
          <img 
            src= {userData?.profilePhoto}
            alt={`${userData?.prenom} ${userData?.nom}`} 
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Profile Picture */}
        <div className="absolute -bottom-14 left-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white transition-transform transform hover:scale-105">
            <img 
              src={userData?.profilePhoto} 
              alt={`${userData?.prenom} ${userData?.nom}`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Edit Button */}
        <div className="absolute right-6 bottom-4">
          <button 
            onClick={() => router.push('/profil')}
            className="px-4 py-2 bg-white text-gray-800 rounded-full font-medium text-sm flex items-center shadow-md hover:bg-gray-50 transition"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    {/* Profile Details */}
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userData?.prenom} {userData?.nom}</h1>
          <p className="text-gray-600">@{userData?.prenom.toLowerCase()}{userData?.nom.toLowerCase()}</p>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div className="text-center">
            <span className="block font-bold text-gray-900">{userData?.followers || 0}</span>
            <span className="text-sm text-gray-600">Followers</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-gray-900">{userData?.following || 0}</span>
            <span className="text-sm text-gray-600">Following</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-4">
        <p className="text-gray-800">{userData?.bio || 'No bio provided yet.'}</p>
        <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 gap-y-2">
          {userData?.role && (
            <div className="flex items-center mr-4">
              <Users className="w-4 h-4 mr-1" />
              <span>{userData.role}</span>
            </div>
          )}
          {userData?.location && (
            <div className="flex items-center mr-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{userData.location}</span>
            </div>
          )}
          {userData?.website && (
            <div className="flex items-center mr-4">
              <LinkIcon className="w-4 h-4 mr-1" />
              <a href={userData.website} className="text-blue-600 hover:underline" target="_blank">
                {userData.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center mr-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {userData?.joinedDate || 'recently'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="flex -mb-px space-x-8">
          {['posts', 'media', 'likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>

    {/* Content Layout */}
    {/* <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto px-6"> */}
      {/* Left Sidebar (Visible on Large Screens) */}
      {/* <aside className="hidden lg:block lg:col-span-3">
        <div className="bg-white rounded-lg shadow-md sticky top-16 p-4">
          <Sidebar />
        </div>
      </aside> */}

      {/* Main Content */}
      <main >
        <Feed className="flex-1"/>
      </main>
          {/* <main>
            <Feed className="flex-1" />
          </main> */}
    {/* </div> */}
  </div>
</div>

  );
}