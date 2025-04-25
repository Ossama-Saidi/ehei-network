import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service'; // si tu veux appeler approveUser
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async getPendingUsers() {
    return this.prisma.utilisateur.findMany({
      where: { is_approved: false },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        is_approved: true,
        createdAt: true,
      },
    });
  }

  async approveUser(id: string) {
    return this.authService.approveUser(id); // génère token + renvoie
  }

  async getUserCountsByRole() {
    const users = await this.prisma.utilisateur.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });
  
    const counts = users.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {});
  
    return counts;
  }
  
  async getMonthlyUserCountsByRole() {
    const results = [];

    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), 11 - i);
      const label = date.toLocaleString('default', { month: 'short' });

      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const data = await this.prisma.utilisateur.groupBy({
        by: ['role'],
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
          is_approved: true, // optionnel selon ton besoin
        },
        _count: {
          _all: true,
        },
      });

      results.push({
        month: label,
        etudiant: data.find(d => d.role === 'ETUDIANT')?._count._all || 0,
        professeur: data.find(d => d.role === 'PROFESSEUR')?._count._all || 0,
        diplome: data.find(d => d.role === 'DIPLOME')?._count._all || 0,
      });
    }

    return results;
  }

}