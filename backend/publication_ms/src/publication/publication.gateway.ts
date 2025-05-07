import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { JwtService } from '@nestjs/jwt'; // ajoute cette ligne

@WebSocketGateway({ cors: true }) // Add CORS configuration if needed
export class PublicationGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => PublicationService))
    private readonly publicationService: PublicationService,
    private readonly jwtService: JwtService, // <-- ajoute ceci
  ) {}

  @SubscribeMessage('createPublication')
  async handleCreatePublication(
    @MessageBody() createPublicationDto: CreatePublicationDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.emit('publicationError', { message: 'Unauthorized: No token' });
        return;
      }
  
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
  
      const publication = await this.publicationService.createPublication(
        createPublicationDto,
        userId,
      );
      client.broadcast.emit('newPublication', publication);
    } catch (error) {
      console.error('Error in handleCreatePublication:', error);
      client.emit('publicationError', { message: 'Failed to create publication.' });
    }
  }
}