import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { io } from 'socket.io-client';
import { getAuthToken } from '@/utils/authUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const reactions = [
    { 
      type: 'J\'aime', 
      apiType: 'Like',
      emoji: <img 
        src="/icons/facebook-like-reactions.png" 
        alt="Like" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'blue'
    },
    { 
      type: 'Love', 
      apiType: 'Love',
      emoji: <img 
        src="/icons/facebook-love-reactions.png" 
        alt="Love" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'red'
    },
    { 
      type: 'Haha', 
      apiType: 'Haha',
      emoji: <img 
        src="/icons/facebook-haha-reactions.png" 
        alt="Haha" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'yellow'
    },
    { 
      type: 'Wow', 
      apiType: 'Like',
      emoji: <img 
        src="/icons/facebook-wow-reactions.png" 
        alt="Wow" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'orange'
    },
    { 
      type: 'Triste', 
      apiType: 'Like',
      emoji: <img 
        src="/icons/facebook-triste-reactions.png" 
        alt="Triste" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'blue'
    },
    { 
      type: 'Grrr', 
      apiType: 'Like', 
      emoji: <img 
        src="/icons/facebook-grrr-reactions.png" 
        alt="Grrr" 
        className="w-8 h-8 object-contain" 
      />, 
      color: 'red'
    }
];

export default function LikeButton({ id_publication, id_user }: any) {
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [showReactions, setShowReactions] = useState(false);
    const [existingReaction, setExistingReaction] = useState(null);
    const [reactionStats, setReactionStats] = useState({
        likeCount: 0,
        loveCount: 0,
        hahaCount: 0
    });
    
    // Socket connection
    const [socket, setSocket] = useState(null);

    // Connect to socket once when component mounts
    useEffect(() => {
        console.log('Rendering LikeButton for', id_publication);

        const newSocket = io(process.env.NEXT_PUBLIC_URL, {
            transports: ['websocket'],
        });
    
        setSocket(newSocket);
    
        return () => {
            newSocket.disconnect();
        };
    }, []);
    

    // Check if user already reacted to this post
    useEffect(() => {
        const fetchUserReaction = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/reactions/user?publicationId=${id_publication}&userId=${id_user}`, 
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setExistingReaction(data);
                        // Find and set the matching reaction from our list
                        const matchingReaction = reactions.find(r => r.apiType === data.reaction);
                        if (matchingReaction) {
                            setSelectedReaction(matchingReaction);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user reaction:', error);
            }
        };

        const fetchReactionStats = async () => {
            try {
                const response = await fetch(`${API_URL}/reactions/stats/${id_publication}`);
                if (response.ok) {
                    const stats = await response.json();
                    setReactionStats(stats);
                }
            } catch (error) {
                console.error('Error fetching reaction stats:', error);
            }
        };

        if (id_publication && id_user) {
            fetchUserReaction();
            fetchReactionStats();
        }
    }, [id_publication, id_user]);

    // Set up real-time updates using the global approach
    useEffect(() => {
        if (!socket) return;
    
        const handleReactionUpdate = ({ publicationId, stats }) => {
            if (publicationId === id_publication) {
                console.log('Reaction update received via socket', stats);
                setReactionStats(stats);
            }
        };
    
        socket.on('reactionUpdated', handleReactionUpdate);
    
        return () => {
            socket.off('reactionUpdated', handleReactionUpdate);
        };
    }, [socket, id_publication]);
    

    const handleReaction = async (reaction) => {
        setSelectedReaction(reaction);
        
        try {
            const token = getAuthToken(); 
            if (existingReaction) {
                // Update existing reaction
                const response = await fetch(`${API_URL}/reactions/${existingReaction.id_reaction}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        reaction: reaction.apiType
                    }),
                });
                
                if (response.ok) {
                    const updated = await response.json();
                    setExistingReaction(updated);
                    
                    // Optionally emit WebSocket event directly
                    if (socket) {
                        socket.emit('updateReaction', {
                            id: existingReaction.id_reaction,
                            updateReactionDto: {
                                reaction: reaction.apiType
                            }
                        });
                    }
                }
            } else {
                // Create new reaction
                const response = await fetch(`${API_URL}/reactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        id_publication: id_publication,
                        id_user: id_user,
                        reaction: reaction.apiType
                    }),
                });
                console.log('Created reaction, waiting for socket update');
                
                if (response.ok) {
                    const created = await response.json();
                    setExistingReaction(created);
                    
                    // Optionally emit WebSocket event directly
                    if (socket) {
                        socket.emit('createReaction', {
                            id_publication: id_publication,
                            id_user: id_user,
                            reaction: reaction.apiType
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error while reacting:', error);
        } finally {
            setShowReactions(false);
        }
    };
// Add this function to your component
const adjustReactionCount = (reactionType, adjustment) => {
    setReactionStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Determine which count to adjust based on reaction type
      if (reactionType === 'Like') {
        newStats.likeCount = Math.max(0, newStats.likeCount + adjustment);
      } else if (reactionType === 'Love') {
        newStats.loveCount = Math.max(0, newStats.loveCount + adjustment);
      } else if (reactionType === 'Haha') {
        newStats.hahaCount = Math.max(0, newStats.hahaCount + adjustment);
      }
      
      return newStats;
    });
  };
    const removeReaction = async () => {
        if (!existingReaction) return;
        
        try {
            const token = getAuthToken();
            // Store the reaction type before deletion
            const reactionType = existingReaction.reaction;
            const response = await fetch(`${API_URL}/reactions/${existingReaction.id_reaction}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            
            if (response.ok) {
                setExistingReaction(null);
                setSelectedReaction(null);
                // Immediately update the UI by manually decrementing the count
                adjustReactionCount(reactionType, -1);
                // Emit WebSocket event directly
                if (socket) {
                    socket.emit('deleteReaction', existingReaction.id_reaction);
                }
            }
        } catch (error) {
            console.error('Error removing reaction:', error);
        }
    };

    // Total reaction count
    const totalReactions = reactionStats.likeCount + reactionStats.loveCount + reactionStats.hahaCount;

    return (
        <div className="flex flex-col items-start">
            {/* Reaction stats display */}
            {totalReactions > 0 && (
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                    <div className="flex -space-x-1 mr-1">
                        {reactionStats.likeCount > 0 && (
                            <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center">
                                <img 
                                  src="/icons/facebook-like-reactions.png" 
                                  alt="Like" 
                                  className="w-8 h-8 object-contain" 
                                />
                            </div>
                        )}
                        {reactionStats.loveCount > 0 && (
                            <div className="w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center">
                                <img 
                                  src="/icons/facebook-love-reactions.png" 
                                  alt="Like" 
                                  className="w-8 h-8 object-contain" 
                                />
                            </div>
                        )}
                        {reactionStats.hahaCount > 0 && (
                            <div className="w-4 h-4 rounded-full bg-yellow-500 border border-white flex items-center justify-center">
                                <img 
                                  src="/icons/facebook-haha-reactions.png" 
                                  alt="Like" 
                                  className="w-8 h-8 object-contain" 
                                />
                            </div>
                        )}
                    </div>
                    <span>{totalReactions}</span>
                </div>
            )}
            
            {/* Reaction button */}
            <div 
                className="relative"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
            >
                <button 
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => {
                        if (selectedReaction) {
                            removeReaction();
                        } else {
                            // Default to like if clicked directly
                            handleReaction(reactions[0]);
                        }
                    }}
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
                    <div className="relative z-50 bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white shadow-lg rounded-full p-2 border border-gray-100 mb-2 animate-pop-in">
                        {reactions.map((reaction) => (
                            <div
                                key={reaction.type}
                                className="flex flex-col items-center cursor-pointer hover:scale-125 transition-transform"
                                onClick={() => {
                                    handleReaction(reaction);
                                  }}
                                title={reaction.type}
                            >
                                <span className="text-3xl hover:animate-bounce">{reaction.emoji}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}