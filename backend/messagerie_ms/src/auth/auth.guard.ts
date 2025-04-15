// publication-service/src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token non fourni');
    }
    
    try {
      // Communiquer avec le service utilisateur via RabbitMQ pour vérifier le token
      const response = await firstValueFrom(
        this.userServiceClient.send({cmd: 'verify_jwt'}, token).pipe(
          timeout(15000), // ⏱️ 15 secondes pour attendre une réponse
          catchError((err) => {
            console.error('[PUBLICATION_SERVICE] ❌ Erreur communication microservice USER:', err);
            throw new UnauthorizedException('Le microservice ne répond pas');
          }),          
        )
      );
      
      if (!response.isValid) {
        throw new UnauthorizedException('Token invalide');
      }
      
      // Attacher les informations utilisateur à la requête
      request.user = response.user;
      console.log('[PUBLICATION_SERVICE] ✅ Token validé, utilisateur :', response.user);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Erreur d\'authentification');
    }
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}