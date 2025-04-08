import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Publication } from '../entities/publication.entity';
import { User } from '../entities/user.entity';
import { Groupe } from '../entities/groupe.entity';

@Injectable()
export class MicroservicesClient {
  private readonly logger = new Logger(MicroservicesClient.name);

  constructor(private readonly httpService: HttpService) {}

  private async callService<T>(service: string, endpoint: string): Promise<T | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(`http://${service}${endpoint}`)
      );
      return data;
    } catch (error) {
      this.logger.error(`Service ${service} error: ${error.message}`);
      return null;
    }
  }

  async getPublication(id: number): Promise<Publication | null> {
    return this.callService<Publication>('publication-service', `/publications/${id}`);
  }

  async getUser(id: number): Promise<User | null> {
    return this.callService<User>('user-service', `/users/${id}`);
  }

  async getGroup(id: number): Promise<Groupe | null> {
    return this.callService<Groupe>('group-service', `/groups/${id}`);
  }
}