import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@WebSocketGateway({ cors: true }) // Add CORS configuration if needed
export class PublicationGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => PublicationService))
    private readonly publicationService: PublicationService,
  ) {}

  @SubscribeMessage('createPublication')
  async handleCreatePublication(
    @MessageBody() createPublicationDto: CreatePublicationDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const publication = await this.publicationService.createPublication(createPublicationDto);
      client.broadcast.emit('newPublication', publication);
    } catch (error) {
      console.error('Error in handleCreatePublication:', error);
      client.emit('publicationError', { message: 'Failed to create publication.' });
    }
  }
}