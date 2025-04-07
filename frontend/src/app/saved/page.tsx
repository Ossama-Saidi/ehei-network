// pages/saved.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Book, Bookmark,  ChevronDown,  Settings2,  Grid, MoreHorizontal, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = 'recent' | 'oldest' | 'relevant';

interface PublicationDetails {
  id_publication: number;
  id_user: number;
  description: string;
  date_publication: string;
  image?: string;
}
interface SavedPublication {
  id_save: number;
  id_user: number;
  id_publication: number;
  publication?: PublicationDetails;
}
interface ApiResponse {
  data: SavedPublication[];
  pagination: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

const SavedPostsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');
    const [savedPosts, setSavedPosts] = useState<SavedPublication[]>([]);
    const [pagination, setPagination] = useState({ skip: 0, take: 3, hasMore: false });
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [sortLabel, setSortLabel] = useState<string>('Plus récent');

    const userId = 101; // Replace with actual authenticated user ID if needed

    useEffect(() => {
      fetchSavedPosts();
    }, [sortBy]);
    
    const fetchSavedPosts = async (skip = 0, append = false) => {
        try {
          const res = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/publication-saves/saves/${userId}`, {
            params: {
              skip, 
              take: pagination.take,
              includeDetails: true,
              sortBy
            },
          });
          if (append) {
            setSavedPosts(prev => [...prev, ...res.data.data]);
          } else {
            setSavedPosts(res.data.data);
          }
          setPagination({
            skip: skip + res.data.data.length,
            take: pagination.take,
            hasMore: res.data.pagination.hasMore
          });
        } catch (error) {
          console.error("Failed to retrieve saved publications.", error);
        } finally {
          setLoading(false);
        }
      };

    const removeFromSaved = async (id_save: any, id_publication: any) => {
      try {
        const requestData = {
          id_publication: Number(id_publication),
          id_user: Number(userId)
        };
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publication-saves/save`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        // Remove post from state
        setSavedPosts(savedPosts.filter(post => post.id_save !== id_save));
      } catch (error) {
        console.error("Error removing saved post:", error);
      }
    };
    
    const handleSortChange = (option: SortOption, label: string) => {
      setSortBy(option);
      setSortLabel(label);
    };

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button className="text-xl font-semibold">Enregistrements</button>
          <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center p-2 hover:bg-gray-100 rounded-full">
              <Settings2 className="h-5 w-5 mr-1" />
              <span className="text-sm">{sortLabel}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange('recent', 'Plus récent')}>
                Plus récent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('oldest', 'Plus ancien')}>
                Plus ancien
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('relevant', 'Plus pertinent')}>
                Plus pertinent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Bookmark className="h-6 w-6" />
        </div>
        </div>
  
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 p-3 flex items-center justify-center ${activeTab === 'all' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            <Grid className="mr-2 h-5 w-5" />
            Toutes les publications
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 p-3 flex items-center justify-center ${activeTab === 'collections' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            <Book className="mr-2 h-5 w-5" />
            Collections
          </button>
        </div>
  
        {/* Posts */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="col-span-3 text-center py-8">Chargement...</p>
          ) : savedPosts.length === 0 ? (
            <p className="col-span-3 text-center py-8">Aucune publication enregistrée.</p>
          ) : (
            savedPosts.map((item) => {
              const publication = item.publication;
              if (!publication) return null;
  
              return (
                <div key={item.id_save} className="bg-gray-50 rounded-lg shadow p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {publication.id_user ? publication.id_user : 'Utilisateur'}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-200">
                        <MoreHorizontal className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => removeFromSaved(item.id_save, item.id_publication)}>
                          Supprimer des enregistrements
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Ajouter à la collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className='justify-between items-end'>
                    {publication.image && (
                      <div className="relative w-full h-48 mb-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STATIC_DIR}/uploads/${publication.image}`} 
                          alt="Publication image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    {/* Description */}
                      <p className="text-sm text-gray-800 line-clamp-4">{publication.description}</p>
                      {/* Time Ago */}
                      <div className="flex items-center justify-between mt-3 space-x-1">
                      <p className="text-xs text-gray-500 mt-2">
                        Publiée {formatDistanceToNow(new Date(publication.date_publication), { addSuffix: true })}
                      </p> 
                      <Link href={`/publication/${publication.id_publication}`} passHref>
                        <button className="flex items-center text-xs text-blue-500 hover:text-blue-700">
                          <span className="mr-1">Voir plus</span>
                          {/* <Maximize2 className='h-4 w-4' /> */}
                        </button>
                      </Link>

                    </div>
                  </div>         
                </div>
              );
            })
          )}
        </div>
  
        {/* Load More */}
        {pagination.hasMore && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => fetchSavedPosts(pagination.skip, true)}
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-800 bg-stone-100 shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200"
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default SavedPostsPage;