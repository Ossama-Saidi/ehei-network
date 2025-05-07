import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; 
import { NotificationGateway } from '../../../notification_ms/src/notification/notification.gateway';

@Injectable()
export class MessagesService {
  messageRepository: any;
  constructor(
    private readonly prisma: PrismaService,
    // private readonly jwtService: JwtService,
   private readonly notificationGateway: NotificationGateway,
  ) {}

  /*async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new Error('Token is invalid or expired');
    }
  }*/

  async sendMessage(senderId: string, receiverId: string, content: string, type: string): Promise<Message> {
  try {
    // Création du message dans la base de données
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        type, // Le type du message, soit 'text' soit 'file'
      },
    });

    // Envoi de la notification selon le type du message
    this.notificationGateway.sendToUser(receiverId, 'newMessage', {
      senderId,
      content,
      type,  // Inclure le type de message dans la notification
    });

    return message;
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error);
    throw new Error('Impossible d’envoyer le message.');
  }
}

  
  async getMessagesBetweenUsers(senderId: string, receiverId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        isArchived: false, // ✅ Exclure tous les messages archivés
        OR: [
          // Cas où l'utilisateur est l'expéditeur
          {
            senderId,
            receiverId,
            isHidden: false,
          },
          // Cas où l'utilisateur est le destinataire
          {
            senderId: receiverId,
            receiverId: senderId,
            // Pas besoin de filtre sur isHidden ici
          },
        ],
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
  
  
  async updateMessageBySender(
    messageId: string,
    senderId: string,
    updateData: { content?: string; type?: string }
  ): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: Number(messageId) },
    });

    if (!message) {
      throw new Error("Message non trouvé");
    }

    if (message.senderId !== String(senderId)) {
      throw new Error("Accès refusé : Ce message n'appartient pas à l'utilisateur");
    }

    return this.prisma.message.update({
      where: { id: Number(messageId) },
      data: updateData,
    });
  }

  async searchMessagesByContent(content: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        content: {
          contains: content,
        },
        isHidden: false,
        isArchived: false,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async archiveMessage(id: number): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) return null;

    return this.prisma.message.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async hideMessage(id: number): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) return null;

    return this.prisma.message.update({
      where: { id },
      data: { isHidden: true },
    });
  }


  // messages.service.ts
  async getLastMessageBetweenUsers(senderId: string, receiverId: string): Promise<Message | null> {
    const lastMessage = await this.prisma.message.findFirst({
      where: {
        isArchived: false, // Assure-toi de ne pas récupérer des messages archivés
        OR: [
          {
            senderId,
            receiverId,
            isHidden: false,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
            isHidden: false,
          },
        ],
      },
      orderBy: {
        date: 'desc', // Trie par date décroissante pour avoir le dernier message
      },
    });
  
    return lastMessage; // Retourne le dernier message ou null s'il n'y en a pas
  }
  
  }
  
  
  


