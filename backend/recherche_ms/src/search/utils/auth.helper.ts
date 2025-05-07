import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthHelper {
  constructor(private httpService: HttpService) {}

  async verifyToken(token: string): Promise<{ userId: number }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ userId: number }>('http://auth-service/api/verify-token', {
          headers: { Authorization: token }
        })
      );
      return data;
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }
}