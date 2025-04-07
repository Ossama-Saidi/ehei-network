"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const passport_1 = require("@nestjs/passport");
const auth_dto_1 = require("../auth/dto/auth.dto");
const multer_1 = require("@nestjs/platform-express/multer");
const jwt = __importStar(require("jsonwebtoken"));
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserProfileJwt(req) {
        const userToken = req.headers["authorization"].split(" ")[1];
        const userId = jwt.decode(userToken)['sub'];
        const user = await this.userService.getUserById(Number(userId));
        if (!userId) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, data: user };
    }
    async getUserProfil(req) {
        const userId = req.user['id'];
        const user = await this.userService.getUserById(Number(userId));
        if (!userId) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, data: user };
    }
    async getUserProfile(id) {
        const user = await this.userService.getUserById(Number(id));
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        return { success: true, data: user };
    }
    async updateProfile(req, updateUserDto) {
        return this.userService.updateUser(req.user.id, updateUserDto);
    }
    async getUser(email) {
        return this.userService.getUserByEmail(email);
    }
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
    async modify(req, updateData) {
        return this.userService.modify(req.user['id'], updateData);
    }
    async changePassword(req, data) {
        return this.userService.changePassword(req.user['id'], data.oldPassword, data.newPassword);
    }
    async sendFriendshipInvitation(req, receiverId) {
        return this.userService.sendFriendshipInvitation(req.user['id'], receiverId);
    }
    async acceptFriendship(req, senderId) {
        return this.userService.acceptFriendship(req.user['id'], senderId);
    }
    async rejectFriendship(req, senderId) {
        return this.userService.rejectFriendship(req.user['id'], senderId);
    }
    async deleteFriend(req, friendId) {
        return this.userService.deleteFriend(req.user['id'], friendId);
    }
    async blockFriend(req, friendId) {
        return this.userService.blockFriend(req.user['id'], friendId);
    }
    async enableAccount(userId) {
        return this.userService.enableAccount(userId);
    }
    async disableAccount(userId) {
        return this.userService.disableAccount(userId);
    }
    async uploadBanner(req, file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            const userId = req.user.id;
            const fileUrl = await this.userService.uploadBanner(userId, file);
            return { success: true, message: 'Banner uploaded successfully', url: fileUrl };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async uploadProfile(req, file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            const userId = req.user.id;
            const fileUrl = await this.userService.uploadProfile(userId, file);
            return { success: true, message: 'Profile photo uploaded successfully', url: fileUrl };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('profil/jwt'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfileJwt", null);
__decorate([
    (0, common_1.Get)('profil'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfil", null);
__decorate([
    (0, common_1.Get)('profil/:id'),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('profil'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ModifyUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':email'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('modify'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ModifyUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "modify", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('friendship/send'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendFriendshipInvitation", null);
__decorate([
    (0, common_1.Post)('friendship/accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('senderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptFriendship", null);
__decorate([
    (0, common_1.Post)('friendship/reject'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('senderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "rejectFriendship", null);
__decorate([
    (0, common_1.Delete)('friendship/delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteFriend", null);
__decorate([
    (0, common_1.Post)('friendship/block'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockFriend", null);
__decorate([
    (0, common_1.Patch)(':id/enable'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "enableAccount", null);
__decorate([
    (0, common_1.Patch)(':id/disable'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "disableAccount", null);
__decorate([
    (0, common_1.Post)('/uploadBanner'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('images')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadBanner", null);
__decorate([
    (0, common_1.Post)('/uploadProfile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('images')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map