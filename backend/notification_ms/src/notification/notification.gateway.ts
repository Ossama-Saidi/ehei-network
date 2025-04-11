/*import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // ✅ Activer CORS pour éviter les blocages
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  // Quand un client envoie un message
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    console.log('Message received:', data);
    this.server.emit('newMessage', data); // ✅ Diffusion du message à tous les clients connectés
  }

  // Gérer la connexion d'un client
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Gérer la déconnexion d'un client
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
*/
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  public users = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const receiverId = Array.isArray(client.handshake.query.receiverId)
      ? client.handshake.query.receiverId[0]
      : client.handshake.query.receiverId;

    console.log("Client connecté:", client.id, "avec receiverId:", receiverId);

    if (receiverId) {
      this.users.set(receiverId, client);
    }
  }

  handleDisconnect(client: Socket) {
    console.log("Client déconnecté:", client.id);
    this.users.forEach((socket, id) => {
      if (socket.id === client.id) {
        this.users.delete(id);
      }
    });
  }

  // ✅ Nouvelle méthode centralisée pour envoyer un message à un utilisateur
  sendToUser(userId: string, event: string, payload: any): void {
    const socket = this.users.get(userId);
    if (socket) {
      socket.emit(event, payload);
      console.log("Événement", event, "envoyé à l'utilisateur", userId);
    } else {
      console.log("L'utilisateur", userId, "n'est pas connecté.");
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    const { senderId, receiverId, message } = data;
    this.sendToUser(receiverId, 'newMessage', { senderId, content: message });
  }
}