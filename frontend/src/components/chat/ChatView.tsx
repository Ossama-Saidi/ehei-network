import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mic, Image, Smile, Send, Edit, Archive, EyeOff } from 'lucide-react';
import axios from 'axios';
import { getDecodedToken, authHeader } from '@/utils/authUtils';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

const socket = io('http://localhost:3005', {
  transports: ['websocket'],
});

export type User = {
  id: number;
  nom: string;
  prenom: string;
};

const ChatView = () => {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true); // New state for chat visibility

  const decodedToken = getDecodedToken();
  const token = authHeader();
  const senderId = decodedToken?.sub?.toString();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track user scroll behavior
    // Track if the chat is being loaded for the first time


  const receiverId = selectedUser?.id.toString();
 // const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!senderId || !receiverId) return;
    try {
      const res = await axios.get(`http://localhost:3005/messages/conversation/${senderId}/${receiverId}`, { headers: token });
      setMessages(res.data.status === 'OK' ? res.data.data.map((msg: any) => ({ ...msg, hidden: false })) : []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setMessages([]);
    }
  }, [senderId, receiverId, token]); //cre pas cette fction slm si token chang

  useEffect(() => { //hooks react qui charge auto lorsque reciv chnge et alors va chercher les messages (via fetchMessages)
    if (receiverId) fetchMessages(); // mli selec charger fetch 
  }, [receiverId, fetchMessages]); //chnga id excute use 

  // Listen for user scroll behavior
//   //1️ Il détecte si l’utilisateur scrolle vers le haut (pour lire d’anciens messages)
//  Et dans ce cas, il ne force pas à redescendre en bas.

//  Quand un nouveau message arrive :
//  Si l’utilisateur est en bas du chat → il descend automatiquement pour montrer le nouveau message.
// Si l’utilisateur est en train de lire au-dessus → il le laisse tranquille (pas de scroll auto).


  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    const handleScroll = () => {
      if (messageContainer) {
        const isAtBottom = messageContainer.scrollHeight - messageContainer.scrollTop === messageContainer.clientHeight;
        setIsUserScrolling(!isAtBottom); // Set true if user scrolls up
      }
    };

    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messageContainer) {
        messageContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll to bottom when new messages are loaded or when new message is sent
  useEffect(() => {
    if (!isUserScrolling && messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isUserScrolling]);

  useEffect(() => {
    if (!senderId) return;

    socket.emit('join', senderId);

    const handleNewMessage = (data: any) => {
      const { senderId: newSenderId, receiverId: newReceiverId } = data;
      if ([newSenderId, newReceiverId].includes(receiverId)) {
        setMessages(prev => [...prev, { ...data, hidden: false }]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [receiverId, senderId]);

  const handleSendMessage = async () => {
    if (!senderId || !receiverId || message.trim() === '') return;
    const newMessage = { id: Date.now(), senderId, content: message, hidden: false };

    try {
      await axios.post('http://localhost:3005/messages/send', {
        senderId,
        receiverId,
        content: message,
        type: 'string',
      }, { headers: token });

      socket.emit('sendMessage', { senderId, receiverId, content: message });
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l’envoi du message:', error);
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessageId || editContent.trim() === '') return;
    try {
      await axios.put(`http://localhost:3005/messages/update/${editingMessageId}/${senderId}`, { content: editContent }, { headers: token });
      setMessages(prev => prev.map(msg => msg.id === editingMessageId ? { ...msg, content: editContent } : msg));
      setEditingMessageId(null);
      setEditContent('');
    } catch (error) {
      console.error('Erreur lors de la modification du message :', error);
    }
  };

  const handleArchiveMessage = async (messageId: number) => {
    try {
      await axios.patch(`http://localhost:3005/messages/archive/${messageId}`, null, { headers: token });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error("Erreur lors de l'archivage du message :", error);
    }
  };

  const handleHideMessage = async (messageId: number) => {
    try {
      await axios.patch(`http://localhost:3005/messages/hide/${messageId}`, null, { headers: token });
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, hidden: true } : msg));
    } catch (error) {
      console.error("Erreur lors du masquage du message :", error);
    }
  };

  const filteredMessages = messages.filter(
    msg => !msg.hidden && (!searchTerm || msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCloseChat = () => {
    setIsChatVisible(false); // Hide chat when X is clicked
  };

  return (
    isChatVisible && ( // Only render the chat if it's visible
      <Card className="w-80 shadow-lg">
        <div className="flex justify-between items-center p-3 border-b">
          <span>{selectedUser ? `${selectedUser.nom} ${selectedUser.prenom}` : 'Nouveau message'}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleCloseChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm">À :</span>
            {selectedUser ? (
              <div className="flex bg-blue-100 text-blue-600 rounded-md px-2 py-1 items-center gap-1">
                <span>{selectedUser.nom} {selectedUser.prenom}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => { setSelectedUser(null); setMessages([]); }} />
              </div>
            ) : (
              <div className="flex-1">
                <UserSearch onUserSelect={setSelectedUser} />
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="p-2">
            <Input
              className="w-full text-sm"
              placeholder="🔍 Rechercher dans les messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="h-64 overflow-y-auto p-4 flex flex-col" ref={messageContainerRef}>
          {selectedUser ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`p-2 rounded-lg text-sm ${msg.senderId === senderId ? 'bg-blue-200' : 'bg-gray-200'} max-w-[75%]`}>
                  {editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-1">
                      <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="text-sm" />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleEditMessage}>Enregistrer</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span>{msg.content}</span>
                      {msg.senderId === senderId && (
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }}>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleArchiveMessage(msg.id)}>
                            <Archive className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleHideMessage(msg.id)}>
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm text-center mt-20">
              Sélectionnez un utilisateur pour démarrer une conversation.
            </div>
          )}
        </div>

        <div className="border-t p-2 relative">
          <div className="flex items-center gap-1 mb-2">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setShowEmojiPicker(prev => !prev)}>
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-2 z-50">
              <EmojiPicker onEmojiClick={(emojiData) => {
                setMessage(prev => prev + emojiData.emoji);
                setShowEmojiPicker(false);
              }} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              className="flex-1 text-sm"
              placeholder="Écrire un message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    )
  );
};

interface UserSearchProps {
  onUserSelect: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/user/search?query=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative">
      <Input
        placeholder="Rechercher un utilisateur..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-white"
      />
      {query && results.length > 0 && (
        <div className="absolute bg-white border shadow-lg w-full mt-1 z-10 rounded-md max-h-40 overflow-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onUserSelect(user);
                setQuery('');
                setResults([]);
              }}
            >
              {user.nom} {user.prenom}
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute bg-white border shadow-md w-full mt-1 z-10 rounded-md text-sm px-3 py-2 text-gray-500">
          Chargement...
        </div>
      )}
    </div>
  );
};

export default ChatView;