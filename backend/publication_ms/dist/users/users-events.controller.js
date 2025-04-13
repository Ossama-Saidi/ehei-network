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
exports.UsersEventsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const user_cache_service_1 = require("./user-cache.service");
let UsersEventsController = class UsersEventsController {
    constructor(userCacheService) {
        this.userCacheService = userCacheService;
    }
    async handleUserCreated(user) {
        console.log('[PUBLICATION_SERVICE] 👤 Received user_created event', user);
        this.userCacheService.addUserToCache(user);
    }
    async handleUserUpdated(user) {
        console.log('[PUBLICATION_SERVICE] 🔄 Received user_updated event', user);
        this.userCacheService.updateUserInCache(user);
    }
};
exports.UsersEventsController = UsersEventsController;
__decorate([
    (0, microservices_1.EventPattern)('user_created'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersEventsController.prototype, "handleUserCreated", null);
__decorate([
    (0, microservices_1.EventPattern)('user_updated'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersEventsController.prototype, "handleUserUpdated", null);
exports.UsersEventsController = UsersEventsController = __decorate([
    (0, common_1.Controller)('users-events'),
    __metadata("design:paramtypes", [user_cache_service_1.UserCacheService])
], UsersEventsController);
//# sourceMappingURL=users-events.controller.js.map