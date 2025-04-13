import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './user.interface';
export declare class UserCacheService implements OnModuleInit, OnModuleDestroy {
    private readonly userServiceClient;
    private userCache;
    private refreshTimer;
    constructor(userServiceClient: ClientProxy);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    private scheduleNextMidnightRefresh;
    private clearCache;
    addUserToCache(user: User): void;
    updateUserInCache(user: User): void;
    removeUserFromCache(userId: number): void;
    private loadInitialUsers;
    getUserById(id: number): User | undefined;
    getAllUsers(): User[];
}
