"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCacheService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let UserCacheService = class UserCacheService {
    constructor(userServiceClient) {
        this.userServiceClient = userServiceClient;
        this.userCache = new Map();
        this.scheduleNextMidnightRefresh();
    }
    async onModuleInit() {
        await this.loadInitialUsers();
        this.scheduleNextMidnightRefresh();
    }
    onModuleDestroy() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
    }
    scheduleNextMidnightRefresh() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        this.refreshTimer = setTimeout(async () => {
            console.log('Performing scheduled midnight cache refresh');
            this.clearCache();
            this.scheduleNextMidnightRefresh();
        }, timeUntilMidnight);
        console.log(`Next cache refresh scheduled in ${Math.floor(timeUntilMidnight / 1000 / 60)} minutes`);
    }
    clearCache() {
        const userCount = this.userCache.size;
        this.userCache.clear();
        console.log(`[CACHE] 🧹 Cleared ${userCount} users at midnight`);
    }
    addUserToCache(user) {
        this.userCache.set(user.id, {
            ...user,
            nomComplet: `${user.nom} ${user.prenom}`
        });
        console.log(`[CACHE] ➕ User ${user.id} added`);
    }
    updateUserInCache(user) {
        this.userCache.set(user.id, {
            ...user,
            nomComplet: `${user.nom} ${user.prenom}`
        });
        console.log(`[CACHE] 🔄 User ${user.id} updated`);
    }
    removeUserFromCache(userId) {
        this.userCache.delete(userId);
        console.log(`[CACHE] ❌ User ${userId} removed`);
    }
    async loadInitialUsers() {
        try {
            console.log('[CACHE] 🧳 Loading initial users...');
            const response = this.userServiceClient.send({ cmd: 'get_all_users' }, {});
            console.log('Request sent to user service, waiting for response...');
            const users = await (0, rxjs_1.firstValueFrom)(response);
            console.log('Received response from user service:', users);
            if (!users || users.length === 0) {
                console.warn('[CACHE] ❗ No users found');
                return;
            }
            users.forEach(user => {
                this.addUserToCache(user);
            });
            console.log(`[CACHE] ✅ Loaded ${users.length} users`);
            console.log('Current cache size:', this.userCache.size);
        }
        catch (error) {
            console.error('[CACHE] ❌ Failed to load initial users:', error);
            console.error('Error details:', error.message);
            if (error.stack)
                console.error(error.stack);
        }
    }
    getUserById(id) {
        const numericId = +id;
        return this.userCache.get(numericId);
    }
    getAllUsers() {
        return Array.from(this.userCache.values());
    }
};
exports.UserCacheService = UserCacheService;
exports.UserCacheService = UserCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], UserCacheService);
//# sourceMappingURL=user-cache.service.js.map