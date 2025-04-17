import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { Reaction } from '@prisma/client';
import { ReactionGateway } from './reaction.gateway';

@Injectable()
export class ReactionService {
  constructor(
    private prisma: PrismaService,
    // @Inject(forwardRef(() => ReactionGateway))
    // private readonly reactionGateway: ReactionGateway,

) {}

  async create(createReactionDto: CreateReactionDto) {
    // Create the reaction
    const reaction = await this.prisma.reactions.create({
      data: createReactionDto,
    });

    // Update the publication's reaction count
    await this.updatePublicationReactionCount(
      createReactionDto.id_publication,
      createReactionDto.reaction,
      'increment'
    );

    return reaction;
  }

  async findAll(id_publication: number) {
    return this.prisma.reactions.findMany({
      where: { id_publication },
    });
  }

  async findUserReaction(id_publication: number, id_user: number) {
    return this.prisma.reactions.findFirst({
      where: {
        id_publication,
        id_user,
      },
    });
  }

  async update(id: number, updateReactionDto: UpdateReactionDto) {
    // Get the existing reaction to know which count to decrement
    const existingReaction = await this.prisma.reactions.findUnique({
      where: { id_reaction: id },
    });

    if (!existingReaction) {
      throw new Error('Reaction not found');
    }

    // Decrement the old reaction type count
    await this.updatePublicationReactionCount(
      existingReaction.id_publication,
      existingReaction.reaction,
      'decrement'
    );

    // Update the reaction
    const updatedReaction = await this.prisma.reactions.update({
      where: { id_reaction: id },
      data: updateReactionDto,
    });

    // Increment the new reaction type count
    await this.updatePublicationReactionCount(
      existingReaction.id_publication,
      updateReactionDto.reaction,
      'increment'
    );

    return updatedReaction;
  }

  async remove(id: number) {
    // Get the reaction to know which count to decrement
    const reaction = await this.prisma.reactions.findUnique({
      where: { id_reaction: id },
    });

    if (!reaction) {
      throw new Error('Reaction not found');
    }

    // Delete the reaction
    const result = await this.prisma.reactions.delete({
      where: { id_reaction: id },
    });

    // Decrement the publication's reaction count
    await this.updatePublicationReactionCount(
      reaction.id_publication,
      reaction.reaction,
      'decrement'
    );

    return result;
  }

  private async updatePublicationReactionCount(
    id_publication: number,
    reactionType: Reaction,
    operation: 'increment' | 'decrement'
  ) {
    const value = operation === 'increment' ? 1 : -1;
    
    const updateData = {};
    
    if (reactionType === 'Like') {
      updateData['likeCount'] = { increment: value };
    } else if (reactionType === 'Love') {
      updateData['loveCount'] = { increment: value };
    } else if (reactionType === 'Haha') {
      updateData['hahaCount'] = { increment: value };
    }

    return this.prisma.publications.update({
      where: { id_publication },
      data: updateData,
    });
  }

  async getReactionStats(id_publication: number) {
    const publication = await this.prisma.publications.findUnique({
      where: { id_publication }
    });
  
    // Get the actual reactions counts if the fields don't exist yet
    const likeCount = publication['likeCount'] ?? await this.prisma.reactions.count({
      where: { id_publication, reaction: 'Like' }
    });
    
    const loveCount = publication['loveCount'] ?? await this.prisma.reactions.count({
      where: { id_publication, reaction: 'Love' }
    });
    
    const hahaCount = publication['hahaCount'] ?? await this.prisma.reactions.count({
      where: { id_publication, reaction: 'Haha' }
    });
    
    return {
      likeCount,
      loveCount,
      hahaCount
    };
  }
}