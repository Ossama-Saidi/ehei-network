import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationPayload, NotificationType } from '../interfaces/notification.interface';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

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
}