// publication-service/src/users/user-cache.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './user.interface';

@Injectable()
// export class UserCacheService implements OnModuleInit {
  export class UserCacheService implements OnModuleInit, OnModuleDestroy {
  private userCache: Map<number, User> = new Map();
  private refreshTimer: NodeJS.Timeout;

  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    // Optionally schedule cache clearing to prevent memory bloat
    this.scheduleNextMidnightRefresh(); // Optional
  }

  async onModuleInit() {
    // Fetch users when the service starts
    await this.loadInitialUsers();

    // Schedule daily cache refresh at midnight
    this.scheduleNextMidnightRefresh();
  }

  // Cleanup when module is destroyed
  onModuleDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
  // Schedule the next midnight refresh
  private scheduleNextMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    this.refreshTimer = setTimeout(async () => {
      console.log('Performing scheduled midnight cache refresh');
      this.clearCache();
      // await this.loadInitialUsers();
      
      // Schedule the next day's refresh
      this.scheduleNextMidnightRefresh();
    }, timeUntilMidnight);
    
    console.log(`Next cache refresh scheduled in ${Math.floor(timeUntilMidnight / 1000 / 60)} minutes`);
  }
  // Clear the entire cache
  private clearCache() {
    const userCount = this.userCache.size;
    this.userCache.clear();
    console.log(`[CACHE] 🧹 Cleared ${userCount} users at midnight`);
  }
  // Add methods to be called from event handlers
  addUserToCache(user: User) {
    this.userCache.set(user.id, {
      ...user,
      nomComplet: `${user.nom} ${user.prenom}`
    });
    console.log(`[CACHE] ➕ User ${user.id} added`);
  }

  updateUserInCache(user: User) {
    this.userCache.set(user.id, {
      ...user,
      nomComplet: `${user.nom} ${user.prenom}`
    });
    console.log(`[CACHE] 🔄 User ${user.id} updated`);
  }

  removeUserFromCache(userId: number) {
    this.userCache.delete(userId);
    console.log(`[CACHE] ❌ User ${userId} removed`);
  }

  private async loadInitialUsers() {
    try {
      console.log('[CACHE] 🧳 Loading initial users...');
      
      // Send Request to get all users via RabbitMQ from user service
      const response = this.userServiceClient.send({ cmd: 'get_all_users' }, {});
      console.log('Request sent to user service, waiting for response...');
      
      const users = await firstValueFrom(response);
      console.log('Received response from user service:', users);
      
      if (!users || users.length === 0) {
        console.warn('[CACHE] ❗ No users found');
        return;
      }
      // Add users to the cache
      users.forEach(user => {
        this.addUserToCache(user);
      });
      
      console.log(`[CACHE] ✅ Loaded ${users.length} users`);
      console.log('Current cache size:', this.userCache.size);
    } catch (error) {
      console.error('[CACHE] ❌ Failed to load initial users:', error);
      console.error('Error details:', error.message);
      if (error.stack) console.error(error.stack);
    }
  }

  getUserById(id: number): User | undefined {
    const numericId = +id;
    return this.userCache.get(numericId);
  }

  getAllUsers(): User[] {
    return Array.from(this.userCache.values());
  }
}