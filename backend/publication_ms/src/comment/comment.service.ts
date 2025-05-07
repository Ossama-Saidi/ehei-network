import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(publicationId: number, contenu: string, userId: number) {
    try {
      return await this.prisma.comments.create({
        data: {
          contenu,
          id_user: userId,
          id_publication: publicationId,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to create comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateComment(commentId: number, contenu: string, userId: number) {
    const existing = await this.prisma.comments.findUnique({ where: { id_comment: commentId } });
    if (!existing || existing.id_user !== userId) {
      throw new HttpException('Not authorized to update this comment', HttpStatus.FORBIDDEN);
    }

    return this.prisma.comments.update({
      where: { id_comment: commentId },
      data: { contenu },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const existing = await this.prisma.comments.findUnique({ where: { id_comment: commentId } });
    if (!existing || existing.id_user !== userId) {
      throw new HttpException('Not authorized to delete this comment', HttpStatus.FORBIDDEN);
    }

    return this.prisma.comments.delete({ where: { id_comment: commentId } });
  }

  async getCommentsByPublication(publicationId: number) {
    return this.prisma.comments.findMany({
      where: { id_publication: publicationId },
      // include: { user: true },
      orderBy: { date_comment: 'desc' },
    });
  }

  async getCounts() {
    const [postCount, commentCount] = await Promise.all([
      this.prisma.publications.count(),
      this.prisma.comments.count()
    ]);
  
    return {
      publications: postCount,
      commentaires: commentCount
    };
  }
  
}
