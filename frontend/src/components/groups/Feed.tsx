// Fil d'actualités central
// src/components/Feed.tsx
'use client';
import React from 'react';
interface FeedProps {
  className?: string;
  profilid: any;
}
import { useState, useEffect } from "react";
import io from 'socket.io-client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CreatePublication from '@/components/publication/CreatePublication';
import PublicationsList from '@/components/publication/PublicationsList';
import { Button } from '@/components/ui/button';
import SortFilter from '@/components/publication/SortFilter';
import { Publication } from '@/components/publication/publication.interface';
import { getAuthToken } from '@/utils/authUtils';
const Feed: React.FC<FeedProps> = ({ className, profilid }) => {

  const router = useRouter();  // Initialize router
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');
  const handleClearFilter = () => {
    router.push('/');
  };
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [publications, setPublications] = useState([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('top');
  const token = getAuthToken();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_URL}`); // Connect to your server's WebSocket endpoint

    // Listen for the 'newPublication' event
    socket.on('newPublication', (newPublication) => {
      setPublications((prevPublications) => [newPublication, ...prevPublications]);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      const endpoint = tag 
        ? `${process.env.NEXT_PUBLIC_API_URL}/publications/searchtags?tag=${encodeURIComponent(tag)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/publications/user/${profilid}`;

      try {
        const response = await fetch(endpoint, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }
        let data = await response.json();
        data = data.sort((a: any, b: any) => 
          new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime()
        );
        setPublications(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des publications :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, [tag]); // Dependency array updated to include `tag`

  const [uploading, setUploading] = useState(false);
  const uploadImage = async () => {
    if (!image) {
      console.log('No image to upload');
      return null;
  }

    // Create FormData object
    const formData = new FormData();
    formData.append('file', image);
    
    try {
      setUploading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/publications/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Envoi du token dans l'en-tête
        },
        timeout: 10000 // 10 second timeout
      });
      // console.log('Upload response:', response.data);
      return response.data.imageUrl;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Image upload error:', error.response?.data);
      } else {
        console.error('Image upload error:', error instanceof Error ? error.message : String(error));
      }
      return null;
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (privacy: any, selectedValues: { city: any; company: any; job: any; tech: any; }) => {
    if (!description.trim()) return; // Empêcher les publications vides

    setLoading(true);

    const tags = [
      selectedValues.city,
      selectedValues.company,
      selectedValues.job,
      selectedValues.tech
    ].filter(Boolean); // Filtrer les valeurs nulles ou vides

    const imageUrl = await uploadImage();
    // console.log('Uploaded Image URL:', imageUrl); // Debug log

    // Préparer les données à envoyer au serveur
    const payload = {
        description,
        image: imageUrl,
        tags,
        ville: selectedValues.city,
        entreprise: selectedValues.company,
        typeEmploi: selectedValues.job,
        technologie: selectedValues.tech,
        audience: privacy,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(payload),
      });

      setDescription("");
      setImage(null);
      setVideo(null);

      if (response.ok) {
        toast.success('Publication réussie !');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error("Publication échouée");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
    return (
      <div className="space-y-2 mr-4 ml-4">
        {/* Zone de création de publication */}
        <CreatePublication
            description={description}
            setDescription={setDescription}
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            loading={loading}
            setImage={setImage}
            uploading={uploading}
        />
        {/* Liste des publications */}
        {tag && (
        <Button 
          variant="outline" 
          onClick={handleClearFilter}
          className="fixed top-16 inset-x-0 mx-auto w-fit px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer animate-bounce"
          >
          {/* <ArrowUp /> */}
          Retour au fil d'actualité
        </Button>
        )}
        <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
        <PublicationsList 
          loading={loading} 
          publications={publications} 
          setPublications={setPublications} 
        />
      </div>
    );
  }
export default Feed;