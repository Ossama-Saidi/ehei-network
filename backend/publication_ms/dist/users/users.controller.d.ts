import { UserCacheService } from './user-cache.service';
export declare class UsersController {
    private readonly userCacheService;
    constructor(userCacheService: UserCacheService);
    getUserById(id: number): import("./user.interface").User;
    getAllUsers(): import("./user.interface").User[];
}
