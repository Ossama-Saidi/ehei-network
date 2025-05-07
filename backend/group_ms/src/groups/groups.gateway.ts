// Create a new file: src/groups/groups.gateway.ts
import { Controller, forwardRef, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsService } from './groups.service';
import { NotificationService } from './NotificationService/services/notification.service';
import { NotificationPayload, NotificationType } from 'src/groups/NotificationService/interfaces/notification.interface';

@Controller()
export class GroupsGateway {
  constructor(
    @Inject(forwardRef(() => GroupsService))
    private readonly groupsService: GroupsService,
    private readonly notificationService: NotificationService,
    @Inject('PUBLICATION_SERVICE') 
    private readonly publicationClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') 
    private readonly notificationClient: ClientProxy,
  ) {}

  async notifyNewJoinRequest(groupId: number, userId: number, groupName: string) {
    return this.notificationService.sendGroupJoinRequest(groupId, userId, groupName);
  }

  async sendNotification(payload: NotificationPayload) {
    return this.notificationClient.emit('notification.create', payload);
  }

  async sendGroupJoinRequest(groupId: number, userId: number, groupName: string) {
    return this.sendNotification({
      type: NotificationType.GROUP_JOIN_REQUEST,
      userId,
      groupId,
      groupName,
      message: `New join request for group ${groupName}`,
    });
  }

  async sendGroupInvitation(groupId: number, userId: number, groupName: string) {
    return this.sendNotification({
      type: NotificationType.GROUP_INVITATION,
      userId,
      groupId,
      groupName,
      message: `You have been invited to join ${groupName}`,
    });
  }

  async createGroupPost(postData: {
    groupId: number;
    authorId: number;
    content: string;
    attachments?: string[];
  }) {
    // Send post creation request to publication service
    return this.publicationClient.send('create_group_post', postData).toPromise();
  }

  async getGroupPosts(groupId: number) {
    // Get posts from publication service
    return this.publicationClient.send('get_group_posts', { groupId }).toPromise();
  }
  
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