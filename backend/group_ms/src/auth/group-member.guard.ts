import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const groupId = parseInt(request.params.groupId);

    if (!userId || !groupId) {
      throw new ForbiddenException('Invalid request');
    }

    // Check if the user is a member of the group
    const member = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    return !!member;
  }
}