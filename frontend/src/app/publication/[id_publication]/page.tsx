'use client'
import { useEffect, useState } from 'react';
import { use } from 'react';
import PublicationContent from '@/components/publication/PublicationContent'; // Assuming your component is in the components folder
import { Card, CardContent } from '@/components/ui/card';
import PublicationFooter from '@/components/publication/PublicationFooter';
import PublicationActions from '@/components/publication/PublicationActions';
import PublicationHeader from '@/components/publication/PublicationHeader';

export default function Page({ params }: { params: Promise<{ id_publication: string }> }) {

  const { id_publication } = use(params);
  const id_user = 101; // Replace with actual authenticated user ID if needed
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchPost = async () => {
    if (!id_publication) return; // Don't fetch if there's no ID

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publications/${id_publication}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPublication(data);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
    }finally {
    setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id_publication]);
  
  useEffect(() => {
    console.log('params:', params);
    console.log('id_publication:', id_publication);
    fetchPost();
  }, [id_publication]);
  
  if (loading) return <p>Chargement...</p>;
  if (!publication) return <p>Publication non trouvée.</p>;
  
  return (
    <div className="container mx-auto p-4">
    <Card className="rounded-lg shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <PublicationHeader
          id_user={id_user} 
          date_publication={publication.date_publication} 
        />
        <PublicationActions 
          id_publication={publication.id_publication} 
          id_user={id_user} 
        />
      </div>
      <PublicationContent 
        description={publication.description}
        tags={publication.tags || ''}
        image={publication.image}
      />
      <PublicationFooter 
        id_publication={publication.id_publication} 
        id_user={id_user} 
      />
    </CardContent>
  </Card>
  </div>
  );
};