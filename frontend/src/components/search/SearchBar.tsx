// src/components/SearchBar.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDecodedToken } from '@/utils/authUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: number;
  nom: string;
  displayName?: string;
  type?: string;
  titre?: string;
  prenom?: string;
  contenu?: string;
  imageUrl?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = getDecodedToken()?.sub;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`http://localhost:3006/search/suggest?q=${encodedQuery}${userId ? `&userId=${userId}` : ''}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          if (isFocused) {
            setShowDropdown(true);
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, userId, isFocused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    try {
      // Save search to history
      if (userId) {
        await fetch('http://localhost:3006/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            terme: query,
            utilisateurId: userId
          }),
        });
      }
      
      // Fetch full search results
      performSearch(query);
      
      setShowDropdown(false);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const performSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3006/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terme: searchTerm,
          utilisateurId: userId || null
        }),
      });

      if (response.ok) {
        const results = await response.json();
        // Process search results here - display in dropdown
        setSuggestions(results);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    const searchTerm = suggestion.displayName || suggestion.nom || suggestion.titre || '';
    setQuery(searchTerm);
    performSearch(searchTerm);
    setShowDropdown(false);
  };

  const renderResultItem = (result: SearchResult) => {
    if (result.type === 'user') {
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            {result.imageUrl ? (
              <img src={result.imageUrl} alt={`${result.prenom} ${result.nom}`} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-semibold">{result.prenom?.[0]}{result.nom?.[0]}</span>
            )}
          </div>
          <div>
            <p className="font-medium">{result.prenom} {result.nom}</p>
            <p className="text-xs text-gray-500">Utilisateur</p>
          </div>
        </div>
      );
    } else if (result.type === 'post') {
      return (
        <div>
          <p className="font-medium">{result.titre}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{result.contenu}</p>
          <p className="text-xs text-gray-500">Publication</p>
        </div>
      );
    } else if (result.type === 'tag') {
      return (
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded">
            #{result.nom}
          </span>
        </div>
      );
    } else {
      // Default display for suggestions
      return (
        <div className="flex items-center">
          <Search className="h-4 w-4 mr-2 text-gray-400" />
          <span>{result.displayName || result.nom}</span>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Rechercher..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.length >= 2) {
                setShowDropdown(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label="Edit"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Animated dropdown for suggestions */}
      <AnimatePresence>
        {showDropdown && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-50 max-h-80 overflow-y-auto"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px'
            }}
          >
            {/* Loading indicator */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                <span className="ml-2 text-sm text-gray-500">Recherche en cours...</span>
              </div>
            )}

            {/* Suggestions/results section */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <ul>
                  {suggestions.slice(0, 10).map((suggestion) => (
                    <li
                      key={`suggestion-${suggestion.id}`}
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {renderResultItem(suggestion)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;