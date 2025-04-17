import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ReactionService } from './reaction.service';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ReactionGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly reactionService: ReactionService,  
    private readonly prisma: PrismaService,
  ) {}

  @SubscribeMessage('createReaction')
  async handleCreateReaction(@MessageBody() createReactionDto: CreateReactionDto) {
    const reaction = await this.reactionService.create(createReactionDto);
    const stats = await this.reactionService.getReactionStats(createReactionDto.id_publication);
    
    // Broadcast to all clients - no need for rooms
    this.server.emit('reactionUpdated', {
      publicationId: createReactionDto.id_publication,
      stats
    });
    
    return reaction;
  }

  @SubscribeMessage('updateReaction')
  async handleUpdateReaction(
    @MessageBody() payload: { id: number; updateReactionDto: UpdateReactionDto }
  ) {
    const existingReaction = await this.prisma.reactions.findUnique({
      where: { id_reaction: payload.id },
    });
    
    const reaction = await this.reactionService.update(payload.id, payload.updateReactionDto);
    const stats = await this.reactionService.getReactionStats(existingReaction.id_publication);
    
    // Broadcast to all clients
    this.server.emit('reactionUpdated', {
      publicationId: existingReaction.id_publication,
      stats
    });
    
    return reaction;
  }

  @SubscribeMessage('deleteReaction')
  async handleDeleteReaction(@MessageBody() id: number) {
    const existingReaction = await this.prisma.reactions.findUnique({
      where: { id_reaction: id },
    });
    
    const reaction = await this.reactionService.remove(id);
    const stats = await this.reactionService.getReactionStats(existingReaction.id_publication);
    
    // Broadcast to all clients
    this.server.emit('reactionUpdated', {
      publicationId: existingReaction.id_publication,
      stats
    });
    
    return reaction;
  }
}