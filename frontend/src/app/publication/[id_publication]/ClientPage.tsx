'use client';

import { useEffect, useState } from 'react';
import PublicationContent from '@/components/publication/PublicationContent';
import { Card, CardContent } from '@/components/ui/card';
import PublicationFooter from '@/components/publication/PublicationFooter';
import PublicationActions from '@/components/publication/PublicationActions';
import PublicationHeader from '@/components/publication/PublicationHeader';

interface User {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  role: string;
}

export default function ClientPage({ id_publication }: { id_publication: string }) {
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publications/${id_publication}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPublication(data);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id_publication) fetchPost();
  }, [id_publication]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!publication?.id_user) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${publication.id_user}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [publication?.id_user]);

  if (loading) return <p>Chargement...</p>;
  if (!publication) return <p>Publication non trouvée.</p>;

  const id_user = publication.id_user;

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
              setPublications={setPublication}
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
}
