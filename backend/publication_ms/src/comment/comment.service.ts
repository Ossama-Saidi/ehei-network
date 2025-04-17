import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(publicationId: number, text: string, userId: number) {
    try {
      return await this.prisma.comments.create({
        data: {
          text,
          id_user: userId,
          id_publication: publicationId,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to create comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateComment(commentId: number, text: string, userId: number) {
    const existing = await this.prisma.commentaire.findUnique({ where: { id_commentaire: commentId } });
    if (!existing || existing.id_user !== userId) {
      throw new HttpException('Not authorized to update this comment', HttpStatus.FORBIDDEN);
    }

    return this.prisma.commentaire.update({
      where: { id_commentaire: commentId },
      data: { text },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const existing = await this.prisma.commentaire.findUnique({ where: { id_commentaire: commentId } });
    if (!existing || existing.id_user !== userId) {
      throw new HttpException('Not authorized to delete this comment', HttpStatus.FORBIDDEN);
    }

    return this.prisma.commentaire.delete({ where: { id_commentaire: commentId } });
  }

  async getCommentsByPublication(publicationId: number) {
    return this.prisma.commentaire.findMany({
      where: { id_publication: publicationId },
      include: { user: true },
      orderBy: { date_commentaire: 'desc' },
    });
  }
}
