import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const groupId = parseInt(request.params.groupId);

    if (!userId || !groupId) {
      throw new ForbiddenException('Invalid request');
    }

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return false;
    }

    // Check if the user is the admin of the group
    if (group.createdBy === userId) {
      return true;
    }

    // Check if the user is a member with ADMIN role
    const member = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId,
        role: 'ADMIN',
      },
    });

    return !!member;
  }
}