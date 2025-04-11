import { Injectable } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationController: NotificationController) {}

  notifyPostReaction() {
    this.notificationController.sendNotifications();
  }
  }
export class AppService {
  getHello(): string {
    return 'salam l3alam!';
  }
}

