'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Smile, Image, MoreHorizontal, Edit2, Trash2, X, Check } from 'lucide-react';
import { getAuthToken } from '@/utils/authUtils';
import { formatDistanceToNow } from 'date-fns';
// import SloganSection from './SloganSection';
import { EmojiButton } from '@/components/buttons/EmojiPopover';
import SloganSection from './SloganSection';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface CommentsProps {
  id_publication: number;
  id_user: number;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  role: string;
}

interface Comment {
  id: number;
  authorId: number;
  contenu: string;
  timestamp: string;
  likes: number;
}

const Comments: React.FC<CommentsProps> = ({ id_publication, id_user }) => {
  const [userCache, setUserCache] = useState<User | null>(null);
  const token = getAuthToken(); 
  const [loading, setLoading] = useState(true);
  const [addRandomSlogan, setAddRandomSlogan] = useState(true);
  const [authorCache, setAuthorCache] = useState<{ [key: number]: User }>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user data from your API (publication service)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id_user}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserCache(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id_user]);
  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/publication/${id_publication}`);
        const data = await res.json();
        const normalized = data.map((c: any) => ({
          id: c.id_comment,
          authorId: c.id_user,
          contenu: c.contenu,
          timestamp: c.date_comment,
          likes: 0, // or c.likes if it exists in your backend
        }));
        setComments(normalized);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };
    fetchComments();
  }, [id_publication]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const uniqueAuthorIds = Array.from(new Set(comments.map(c => c.authorId)));
      const newCache: { [key: number]: User } = { ...authorCache };

      await Promise.all(
        uniqueAuthorIds.map(async (id) => {
          if (!newCache[id]) {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
              if (!res.ok) throw new Error("User fetch failed");
              const data = await res.json();
              newCache[id] = data;
            } catch (err) {
              console.error("Error fetching user", id, err);
            }
          }
        })
      );

      setAuthorCache(newCache);
    };
    if (comments.length > 0) fetchAuthors();
  }, [comments]);

  const handleCommentSubmit = async () => {
    try {
      const baseContent = newComment.trim();
      if (!baseContent) return;
  
      // Generate fun slogans based on user identity
      const slogans = [
        `Je te félicite chaleureusement, ${userCache?.prenom} 💬`,
        `C'est impressionnant ! Bravo 👏 de la part de ${userCache?.nomComplet}`,
        `Continue comme ça champion ✨ — signé ${userCache?.prenom}`,
        `Un grand bravo, ${userCache?.prenom} est fan 🔥`,
        `${userCache?.prenom} t'encourage depuis EHEI Connect 🌟`,
        `💡 De la part de ${userCache?.role === 'professeur' ? 'Professeur' : 'Étudiant'} ${userCache?.nomComplet}`,
        "You're doing amazing!",
        "Never stop growing!",
        "Success is near, keep going!",
        "Your effort matters!",
        "Today is your day!",
        "You're on the right path!",
        "Knowledge is your superpower!",
        "Make today count!"
      ];
      const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
  
      const contentWithSlogan = `${baseContent} — ${randomSlogan}`;
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id_publication}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu: contentWithSlogan }),
      });
  
      if (!res.ok) throw new Error('Failed to post comment');
      const created = await res.json();
  
      const normalizedCreated = {
        id: created.id_comment,
        authorId: created.id_user,
        contenu: created.contenu,
        timestamp: created.date_comment,
        likes: 0,
      };
      setComments(prev => [...prev, normalizedCreated]);
  
      // Update author cache
      if (userCache) {
        setAuthorCache(prev => ({
          ...prev,
          [userCache.id]: userCache,
        }));
      }
  
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment', err);
    }
  };
  

  const handleEdit = (id: number, currentContent: string) => {
    setEditingCommentId(id);
    setEditContent(currentContent);
    setOpenMenuId(null); // Close menu when starting to edit
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editContent.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${editingCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu: editContent }),
      });

      if (!res.ok) throw new Error('Failed to update comment');

      // Update the local state with the edited comment
      setComments(prev => 
        prev.map(comment => 
          comment.id === editingCommentId 
            ? { ...comment, contenu: editContent } 
            : comment
        )
      );

      // Reset edit state
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('Error updating comment', err);
    }
  };

   // Modifier la fonction handleDelete pour ouvrir la boîte de dialogue de confirmation
   const handleDelete = (id: number) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
    setOpenMenuId(null); // Fermer le menu des options
  };

  const handleDeleteConfirm  = async () => {
    if (!commentToDelete) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }        
      });
      setComments(prev => prev.filter(comment => comment.id !== commentToDelete));
      // Afficher la notification toast
      toast.warning(`Commentaire supprimé`, {
        description: `Le commentaire a été supprimé avec succès.`,
      });
    } catch (err) {
      console.error('Error deleting comment', err);
       // Afficher un message d'erreur dans le toast
       toast.error(`Erreur`, {
        description: `Impossible de supprimer le commentaire. Veuillez réessayer.`,
      });
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const author = authorCache[comment.authorId];
    const isEditing = editingCommentId === comment.id;

    return (
      <div className="flex space-x-3 py-2 border-b">
        <Avatar className="w-10 h-10">
          {/* <AvatarImage src="/placeholder.png" /> */}
          <AvatarFallback>
            {author ? author.nomComplet.slice(0, 2).toUpperCase() : '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">
                {author?.nomComplet || 'Utilisateur inconnu'}
                {id_user === author?.id && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Auteur
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">{author?.role}</p>
            </div>
            <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.timestamp ?? Date.now()), { addSuffix: true })}
            </span>
            {id_user === comment.authorId && openMenuId === comment.id && (
              <>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(comment.id, comment.contenu)}
                  >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}

            {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setOpenMenuId(prev => (prev === comment.id ? null : comment.id))
                  }
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              )}
          </div>
          </div>

          {isEditing ? (
            <div className="mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Tell them what you loved..."
                className="w-full p-2 border rounded-lg resize-none min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex items-center"
                >
                  <X className="w-4 h-4 mr-1" /> Annuler
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                  className="flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" /> Enregistrer
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm">{comment.contenu}</p>
          )}
          
          {!isEditing && (
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                Like {comment.likes > 0 && `(${comment.likes})`}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                Reply
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  // Get initials for avatar fallback
  const getInitials = () => {
    if (userCache && userCache.nom && userCache.prenom) {
      return `${userCache ? userCache.nomComplet.slice(0, 2).toUpperCase() : '??'}`;
    }
    return 'U'; // Default fallback
  };
  return (
    <div className="w-full">
      {/* Ajoutez la boîte de dialogue de confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* New Comment Input */}
      <div className="flex space-x-2 mb-4">
        <Avatar className="w-10 h-10">
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tell them what you loved..."
            className="w-full p-2 border rounded-lg resize-none min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <EmojiButton onSelect={(emoji: string) => setNewComment((prev) => `${prev}${emoji}`)} />
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Image className="w-5 h-5" />
            </Button>
          </div>
        </div>

          <Checkbox
          id="randomSlogans"
          checked={addRandomSlogan}
          onCheckedChange={(checked) => {
            // Explicitly handle the possible values
            if (checked === true) {
              setAddRandomSlogan(true);
            } else {
              setAddRandomSlogan(false);
            }
          }}
        />
        <label htmlFor="randomSlogans" className="text-sm m-2">
            Utilisez des slogans aléatoires
        </label>
          <div className="flex justify-between items-center mt-2">
          {userCache && (
            <div className="flex space-x-2 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewComment((prev) => `${prev}${prev ? ' ' : ''}Great job!`)
                }
              >
                Great job!
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewComment((prev) => `${prev}${prev ? ' ' : ''}Keep it up!`)
                }
              >
                Keep it up!
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewComment((prev) => `${prev}${prev ? ' ' : ''}Proud of you!`)
                }
              >
                Proud of you!
              </Button>
            </div>
          )}
            <Button
              disabled={!newComment.trim()}
              className="ml-2"
              onClick={handleCommentSubmit}
            >
              Envoyer
            </Button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="mt-4">
        {comments.map((comment, index) => (
          <CommentItem key={comment.id ?? index} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
