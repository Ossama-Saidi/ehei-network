import { UserCacheService } from './user-cache.service';
import { User } from './user.interface';
export declare class UsersEventsController {
    private readonly userCacheService;
    constructor(userCacheService: UserCacheService);
    handleUserCreated(user: User): Promise<void>;
    handleUserUpdated(user: User): Promise<void>;
}
