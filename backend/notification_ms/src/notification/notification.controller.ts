
// import { Body, Controller, Get, Post, Sse, Param } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { NotificationSse } from './notification.sse';
// import { NotificationService } from './notification.service';




// @Controller('notifications')
// export class NotificationController {
//   constructor(private readonly notificationSse: NotificationSse,
//               private readonly notificationService: NotificationService
//   ) {}

//   @Sse('sse')
//   sendNotifications(notification?: any): Observable<{ event: string; data: any }> {
//     return this.notificationSse.getEventStream();
//   }
//   @Post('post-reaction')
//   notifyPostReaction(@Body() notification: any) {
//     this.notificationSse.notifyClients('post-reaction', notification);
//   }
//   // ✅ Nouvelle route : invitation d’amitié
//   @Post('friend-invite')
//   async notifyFriendInvite(@Body() notification: any) {
//     const { userId, type, data, } = notification;
//     // Envoi SSE
//     this.notificationSse.notifyFriendInvite(userId, type);
//     // Sauvegarde en base de données
//   await this.notificationService.create('friend-invite', {
//     userId,
//     type,
//     data: `vous a envoyé une invitation d’amitié`,
//   });

//   return { success: true };
//   }
//   // ✅ Endpoint pour récupérer les notifications d'un utilisateur
//   @Get('user/:userId')
//   async getUserNotifications(@Param('userId') userId: string) {
//     console.log('userId:',userId);
//     const notifications = await this.notificationService.findByUserId(userId);
//     console.log('notifications:',notifications);
//     return notifications;
//   }
  
// }

import { Body, Controller, Get, Post, Sse, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationSse } from './notification.sse';
import { NotificationService } from './notification.service';

// Define proper interfaces for type safety
export interface NotificationDto {
  userId: string;
  type: string;
  data: any;
  senderId?: string;
}

export interface FriendInviteDto {
  userId: string;     // Recipient user ID
  senderId: string;   // User who sent the invitation
  type?: string;      // Optional as we'll set default in controller
}

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationSse: NotificationSse,
    private readonly notificationService: NotificationService
  ) {}

  @Sse('sse')
  sendNotifications(): Observable<{ event: string; data: any }> {
    return this.notificationSse.getEventStream();
  }

  @Post('post-reaction')
  async notifyPostReaction(@Body() notification: NotificationDto) {
    this.notificationSse.notifyClients('post-reaction', notification);
    
    // Also save reaction notifications to database for consistency
    await this.notificationService.create(
      'post-reaction',
      notification.userId,
      notification.data
    );
    
    return { success: true };
  }

  @Post('friend-invite')
  async notifyFriendInvite(@Body() invitation: FriendInviteDto) {
    const notificationType = 'friend-invite';
    
    // Ensure both required IDs are present
    if (!invitation.userId || !invitation.senderId) {
      return { success: false, message: 'Both userId and senderId are required' };
    }
    
    // Send SSE notification
    this.notificationSse.notifyFriendInvite(invitation.userId, notificationType);
    
    // Save in database with formatted message
    await this.notificationService.create(
      notificationType,
      invitation.userId,
      {
        senderId: invitation.senderId,
        message: `vous a envoyé une invitation d'amitié`
      }
    );

    return { success: true };
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.findByUserId(userId);
  }
  
  @Post('mark-as-read/:id')
  async markNotificationAsRead(@Param('id') id: string) {
    return {
      success: true,
      notification: await this.notificationService.markAsRead(id)
    };
  }
  
  @Post('update/:id')
  async removeNotification(@Param('id') id: string) {
    await this.notificationService.update(id);
    return { success: true };
  }
}