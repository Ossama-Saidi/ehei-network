import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export default function ReportedPostsSection() {
  const [reportedPosts, setReportedPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3003/api/publications/reported-posts')
      .then(res => res.json())
      .then(async (posts) => {
        const withSignalerNames = await Promise.all(posts.map(async post => {
          const signalerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${post.id_user}`);
          const signaler = await signalerRes.json();

          const authorRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${post.publication.id_user}`);
          const author = await authorRes.json();

          return {
            ...post,
            signalerName: `${signaler.nom} ${signaler.prenom}`,
            authorName: `${author.nom} ${author.prenom}`
          };
        }));
        setReportedPosts(withSignalerNames);
      });
  }, []);

  const archivePost = async (publicationId) => {
    await fetch(`http://localhost:3003/api/publications/reported-posts/${publicationId}/archive`, { method: 'POST' });
    setReportedPosts(prev => prev.filter(post => post.id_publication !== publicationId));
  };

  return (
    <section className="mt-6 grid grid-cols-2 gap-4">
      {reportedPosts.length === 0 ? (
        <p className="text-gray-500">Aucune publication signalée.</p>
      ) : (
        reportedPosts.map(post => (
          <Card key={post.id_archive} className="relative">
            {/* Bouton X pour ignorer la publication */}
            <button
                onClick={() => setReportedPosts(prev =>
                prev.filter(p => p.id_archive !== post.id_archive)
                )}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Ignorer cette publication"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                {post.publication.description.substring(0, 40)}...
              </CardTitle>
              <p className="text-sm text-gray-500">Par {post.authorName}</p>
            </CardHeader>
            <CardContent>
              {post.publication.image && (
                <img
                  src={post.publication.image}
                  alt="Post Image"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <p className="text-sm text-gray-700 mb-4">{post.publication.description}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  Signalé par {post.signalerName}
                </span>

                <div className="relative">
                  <Button
                    onClick={() => archivePost(post.id_publication)}
                    variant="destructive"
                    size="sm"
                  >
                    Archiver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
        ))
      )}
    </section>
  );
}
