// src/app/search/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDecodedToken } from '@/utils/authUtils';
import Header from '@/components/Header';
import SearchBar from '@/components/search/SearchBar';
import { Search } from 'lucide-react';

interface SearchResult {
  id: number;
  type: string;
  titre?: string;
  nom?: string;
  prenom?: string;
  contenu?: string;
  imageUrl?: string;
  // Add more fields as needed
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = getDecodedToken()?.sub;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the POST endpoint to get search results
        const response = await fetch('http://localhost:3006/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            terme: query,
            utilisateurId: userId || null
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.error('Error fetching search results');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, userId]);

  const renderResultItem = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        return (
          <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              {result.imageUrl ? (
                <img src={result.imageUrl} alt={`${result.prenom} ${result.nom}`} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-lg font-semibold">{result.prenom?.[0]}{result.nom?.[0]}</span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{result.prenom} {result.nom}</h3>
              <p className="text-sm text-gray-600">Utilisateur</p>
            </div>
          </div>
        );
      case 'post':
        return (
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium">{result.titre}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.contenu}</p>
            <p className="text-xs text-gray-500 mt-2">Publication</p>
          </div>
        );
      case 'tag':
        return (
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded"># {result.nom}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Tag</p>
          </div>
        );
      default:
        return (
          <div className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium">{result.titre || result.nom}</h3>
            <p className="text-xs text-gray-500 mt-2">Résultat</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Résultats pour "{query}"
          </h1>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Chargement des résultats...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={`${result.type}-${result.id}`}>
                  {renderResultItem(result)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl font-medium text-gray-700">Aucun résultat trouvé</p>
              <p className="mt-2 text-gray-600">Essayez une autre recherche ou modifiez vos termes de recherche</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}