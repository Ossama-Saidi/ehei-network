// import { Injectable } from '@nestjs/common';
// import { NotificationRepository } from './notification.repository';

// @Injectable()
// export class NotificationService {
//   constructor(private readonly notificationRepo: NotificationRepository) {}

//   // ✅ Créer une notification
//   async create(type: string, userId: string, data: any) {
//     return this.notificationRepo.create(type, userId, data);
//   }

//   // ✅ Récupérer toutes les notifications
//   // async findAll() {
//   //   return this.notificationRepo.findAll();
//   // }

//   // ✅ Récupérer les notifications d’un utilisateur
//   async findByUserId(userId: string) {
//     return this.notificationRepo.findByUserId(userId);
//   }

//   // ✅ Marquer comme lue
//   async markAsRead(id: string) {
//     return this.notificationRepo.markAsRead(id);
//   }

//   // ✅ Supprimer
//   async remove(id: string) {
//     return this.notificationRepo.delete(id);
//   }
// }

import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

export interface NotificationCreateParams {
  type: string;
  userId: string;
  data: any;
}

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  /**
   * Create a new notification
   * @param type Notification type identifier
   * @param userId ID of the user receiving the notification
   * @param data Additional notification data
   */
  async create(type: string, userId: string, data: any) {
    return this.notificationRepo.create(type, userId, data);
  }

  /**
   * Get all notifications for a specific user
   * @param userId User ID to fetch notifications for
   */
  async findByUserId(userId: string) {
    return this.notificationRepo.findByUserId(userId);
  }

  /**
   * Mark a notification as read
   * @param id Notification ID
   */
  async markAsRead(id: string) {
    return this.notificationRepo.markAsRead(id);
  }

  /**
   * Remove a notification
   * @param id Notification ID
   */
  async update(id: string) {
    return this.notificationRepo.update(id);
  }
}