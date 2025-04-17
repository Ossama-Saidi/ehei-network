'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mic, Image, Smile, Send, Paperclip, ThumbsUp, Gift } from 'lucide-react';

const ChatView = () => {
  const [message, setMessage] = useState('');

  return (
    <Card className="w-80 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 p-3 border-b">
        <div className="flex items-center gap-2">
          <span className="font-medium">Nouveau message</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Recipient */}
      <div className="p-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm">À :</span>
          <div className="flex bg-blue-100 text-blue-600 rounded-md px-2 py-1 items-center gap-1">
            <span className="text-sm">Ossama</span>
            <X className="h-3 w-3 cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Chat Body */}
      <div className="h-64 overflow-y-auto p-4 flex flex-col items-center justify-center">
        <Avatar className="h-16 w-16 mb-2">
          <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-2xl">👤</span>
          </div>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium text-lg">Ossama</h3>
          <p className="text-xs text-gray-500 mt-2">Jeu 19:16</p>
          <p className="text-xs text-gray-500 mt-1">Envoyé il y a 3 j</p>
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="border-t p-2">
        <div className="flex items-center gap-1 mb-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Mic className="h-5 w-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Image className="h-5 w-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Gift className="h-5 w-5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Smile className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Input 
            className="rounded-full bg-gray-100"
            placeholder="Aa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8"
            disabled={!message}
          >
            {message ? (
              <Send className="h-5 w-5 text-blue-500" />
            ) : (
              <ThumbsUp className="h-5 w-5 text-blue-500" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatView;