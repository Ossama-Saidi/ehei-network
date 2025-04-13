import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Smile, Image } from 'lucide-react';

const Comments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: 'Bekkaoui Kamal',
        title: 'Future Software Engineer (Final Year) | Tutor in Mathematics and Physics | PH...',
        avatar: 'https://github.com/shadcn.png'
      },
      text: 'Congrats 🎉 👏',
      likes: 1,
      timestamp: '2w',
      isAuthor: false
    },
    {
      id: 2,
      author: {
        name: 'Ossama Saidi',
        title: '4th-Year Software Engineering Student | Aspiring Software...',
        avatar: 'https://github.com/shadcn.png'
      },
      text: 'Thanks brother 🤝',
      likes: 0,
      timestamp: '2w',
      isAuthor: true
    },
    {
      id: 3,
      author: {
        name: 'Imane Khalaf',
        title: 'Software Engineer Student',
        avatar: 'https://github.com/shadcn.png'
      },
      text: 'Félicitations 🎊',
      likes: 1,
      timestamp: '2w',
      isAuthor: false
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const CommentItem = ({ comment }: any) => (
    <div className="flex space-x-3 py-2 border-b">
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm">
              {comment.author.name}
              {comment.isAuthor && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Author
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{comment.author.title}</p>
          </div>
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
        </div>
        <p className="mt-1 text-sm">{comment.text}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            Like {comment.likes > 0 && `(${comment.likes})`}
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            Reply
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JM</AvatarFallback>
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
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Image className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2 overflow-x-auto">
              <Button variant="outline" size="sm">Congrats Ossama!</Button>
              <Button variant="outline" size="sm">Well done Ossama</Button>
              <Button variant="outline" size="sm">Wishing you the best</Button>
            </div>
            <Button 
              disabled={!newComment.trim()}
              className="ml-2"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;