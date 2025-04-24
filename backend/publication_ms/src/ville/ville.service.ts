import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // adapt if needed

@Injectable()
export class VilleService {
  constructor(private prisma: PrismaService) {}

  create(data: { nom: string }) {
    return this.prisma.ville.create({ data });
  }

  findAll() {
    return this.prisma.ville.findMany();
  }

  findOne(id: number) {
    return this.prisma.ville.findUnique({ where: { id_ville: id } });
  }

  update(id: number, data: { nom: string }) {
    return this.prisma.ville.update({ where: { id_ville: id }, data });
  }

  remove(id: number) {
    return this.prisma.ville.delete({ where: { id_ville: id } });
  }
}