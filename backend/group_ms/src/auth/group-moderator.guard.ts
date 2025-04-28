import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupModeratorGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const groupId = parseInt(request.params.groupId || request.params.id); // Adjusted to handle both cases

    if (!userId || !groupId) {
      throw new ForbiddenException('Invalid request');
    }

    // Check if the user is the admin of the group or a moderator
    const member = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId,
        role: { in: ['ADMIN', 'MODERATOR'] },
      },
    });

    return !!member;
  }
}