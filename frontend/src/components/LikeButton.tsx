import { useState } from 'react';
import { ThumbsUp, Heart, Laugh, Meh, Frown, Angry } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const reactions = [
    { 
      type: 'J\'aime', 
      emoji: <img 
      src="/icons/facebook-like-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'blue'
    },
    { 
      type: 'Love', 
      emoji: <img 
      src="/icons/facebook-love-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'red'
    },
    { 
      type: 'Haha', 
      emoji: <img 
      src="/icons/facebook-haha-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'yellow'
    },
    { 
      type: 'Wow', 
      emoji: <img 
      src="/icons/facebook-wow-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'orange'
    },
    { 
      type: 'Triste', 
      emoji: <img 
      src="/icons/facebook-triste-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'blue'
    },
    { 
      type: 'Grrr', 
      emoji: <img 
      src="/icons/facebook-grrr-reactions.png" 
      alt="Like" 
      className="w-8 h-8 object-contain" 
    />, 
      color: 'red'
    }
  ];

export default function LikeButton({ id_publication, id_user }) {

    const [selectedReaction, setSelectedReaction] = useState(null);
    const [showReactions, setShowReactions] = useState(false);

    const handleReaction = async (reaction) => {
        setSelectedReaction(reaction);
        try {
            await axios.post('/api/reactions', { 
                id_publication, 
                id_user, 
                reaction: reaction.type
            });
        } catch (error) {
            console.error('Erreur lors de la réaction:', error);
        } finally {
            setShowReactions(false);
        }
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
        >
             <button 
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
                {selectedReaction ? (
                <span className="text-2xl">{selectedReaction.emoji}</span>
                ) : (
                <ThumbsUp className="w-4 h-4" />
                )}
                <span className={`font-medium ${selectedReaction ? `text-${selectedReaction.color}-600` : ''}`}>
                {selectedReaction ? selectedReaction.type : "J'aime"}
                </span>
            </button>
            {showReactions && (
                <div className="relative bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white shadow-lg rounded-full p-2 border border-gray-100 mb-2 animate-pop-in">
                {reactions.map((reaction) => (
                    <div
                    key={reaction.type}
                    className="flex flex-col items-center cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => handleReaction(reaction)}
                    title={reaction.type}
                    >
                    <span className="text-3xl hover:animate-bounce">{reaction.emoji}</span>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}