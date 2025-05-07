// src/components/SearchHistory.tsx

'use client';

import { useState, useEffect } from 'react';
import { getDecodedToken } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';
import { Search, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export interface SearchHistoryItem {
  id: number;
  terme: string;
  resultatId: number;
  type: 'utilisateur' | 'groupe' | 'tag' | 'publication';
  date: string;
}

interface SearchHistoryProps {
  visible: boolean;
  onItemClick: (term: string) => void;
}


const SearchHistory: React.FC<SearchHistoryProps> = ({ visible, onItemClick }) => { 
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const router = useRouter();
  const userId = getDecodedToken()?.sub;

  const fetchHistory = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:3006/search/history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchHistory();
    }
  }, [visible, userId]);

  const handleClearHistory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      await fetch(`http://localhost:3006/search/history/${userId}`, {
        method: 'DELETE',
      });
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleNavigate = (item: SearchHistoryItem) => {
    // if (item.type === 'utilisateur') {
      router.push(`/profil/${item.id}`);
    // } else if (item.type === 'groupe') {
    //   router.push(`/groupe/${item.resultatId}`);
    // }
    // Plus besoin d'utiliser onItemNavigate ici
  };  

  const handleDeleteItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      await fetch(`http://localhost:3006/search/history/${userId}/${id}`, {
        method: 'DELETE',
      });
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting search item:', error);
    }
  };

  if (!userId || history.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-40 max-h-80 overflow-y-auto"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <div className="p-2">
            <div className="flex justify-between items-center px-2 py-1 mb-1">
              <h3 className="text-sm font-medium text-gray-500">Recherches récentes</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-xs text-gray-500 hover:text-gray-700 h-auto py-1 px-2"
              >
                Tout effacer
              </Button>
            </div>
            
            <ul className="space-y-1">
              {history.map((item) => (
                <li 
                  key={item.id} 
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleNavigate(item)}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{item.terme}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="text-gray-400 hover:text-gray-600 h-auto p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchHistory;