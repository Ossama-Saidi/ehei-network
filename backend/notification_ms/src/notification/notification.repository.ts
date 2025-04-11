
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class NotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ){}

  // ✅ Créer une nouvelle notification
  async create(type: string, userId: string, data: any){
    return this.prisma.notification.create({
      data: {
        type,
        userId,
        data,
      },
    });
  }

  // ✅ Récupérer toutes les notifications
  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Récupérer les notifications d’un utilisateur (via receiverId dans data JSON)
  async findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Marquer une notification comme lue
  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

 
  // ✅ Supprimer ou archiver une notification (optionnel)
  async update(id: string){

    return this.prisma.notification.update(
      { where: { id }, data: { archived: true } })

  }
}
