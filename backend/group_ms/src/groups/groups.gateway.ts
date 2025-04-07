// Create a new file: src/groups/groups.gateway.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsService } from './groups.service';

@Controller()
export class GroupsGateway {
  constructor(private readonly groupsService: GroupsService) {}

  @MessagePattern('find_user_groups')
  async findUserGroups(@Payload() userId: number) {
    // Find all groups where the user is a member
    const memberships = await this.groupsService.findUserMemberships(userId);
    return memberships.map(membership => membership.group);
  }

  @MessagePattern('check_user_in_group')
  async checkUserInGroup(@Payload() data: { userId: number; groupId: number }) {
    const { userId, groupId } = data;
    return this.groupsService.checkUserInGroup(userId, groupId);
  }
}