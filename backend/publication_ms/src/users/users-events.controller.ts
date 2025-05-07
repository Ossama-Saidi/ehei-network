// publication-service/src/users/users-events.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCacheService } from './user-cache.service';
import { User } from './user.interface';

@Controller('users-events')
export class UsersEventsController {
  constructor(private readonly userCacheService: UserCacheService) {}

  @EventPattern('user_created')
  async handleUserCreated(@Payload() user: User) {
    console.log('[PUBLICATION_SERVICE] 👤 Received user_created event', user);
    this.userCacheService.addUserToCache(user);
  }
  @EventPattern('user_updated')
  async handleUserUpdated(@Payload() user: User) {
    console.log('[PUBLICATION_SERVICE] 🔄 Received user_updated event', user);
    this.userCacheService.updateUserInCache(user); // same method can update
  }

  // @EventPattern('user.updated')
  // handleUserUpdated(user: any) {
  //   console.log('Received user.updated event:', user);
  //   this.userCacheService.updateUserInCache(user);
  // }

  // @EventPattern('user.deleted')
  // handleUserDeleted(payload: { id: number }) {
  //   console.log('Received user.deleted event:', payload);
  //   this.userCacheService.removeUserFromCache(payload.id);
  // }
}