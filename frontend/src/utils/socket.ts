import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

interface MessageData {
  senderId: string;
  receiverId: string;
  content: string;
}

export default function setupSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    const receiverId = socket.handshake.query.receiverId as string;

    if (receiverId) {
      socket.join(receiverId);
    }

    socket.on('sendMessage', (data: MessageData) => {
      const { senderId, receiverId, content } = data;

      io.to(receiverId).emit('newMessage', {
        senderId,
        content,
      });
    });
  });
}
