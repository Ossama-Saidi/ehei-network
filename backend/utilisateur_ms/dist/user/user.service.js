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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserByEmail(email) {
        return this.prisma.utilisateur.findUnique({ where: { email } });
    }
    async getAllUsers() {
        return this.prisma.utilisateur.findMany();
    }
    async updateUser(userId, updateUserDto) {
        return this.prisma.utilisateur.update({
            where: { id: userId },
            data: updateUserDto,
        });
    }
    async getUserById(userId) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
            select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
                telephone: true,
                bio: true,
                profilePhoto: true,
                bannerPhoto: true,
                role: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async modify(userId, updateData) {
        return this.prisma.utilisateur.update({ where: { id: userId }, data: updateData });
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.utilisateur.findUnique({ where: { id: userId } });
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            throw new common_1.UnauthorizedException('Invalid old password');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.utilisateur.update({ where: { id: userId }, data: { password: hashedPassword } });
        return { message: 'Password changed successfully' };
    }
    async sendFriendshipInvitation(senderId, receiverId) {
        const existingInvitation = await this.prisma.Friendship.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });
        if (existingInvitation)
            throw new common_1.UnauthorizedException('Invitation already sent or already friends');
        return this.prisma.Friendship.create({
            data: {
                senderId,
                receiverId,
                status: 'pending',
            },
        });
    }
    async acceptFriendship(userId, senderId) {
        const invitation = await this.prisma.Friendship.findFirst({
            where: {
                senderId,
                receiverId: userId,
                status: 'pending',
            },
        });
        if (!invitation)
            throw new common_1.UnauthorizedException('No pending invitation found');
        return this.prisma.Friendship.update({
            where: { id: invitation.id },
            data: { status: 'accepted' },
        });
    }
    async rejectFriendship(userId, senderId) {
        const invitation = await this.prisma.Friendship.findFirst({
            where: {
                senderId,
                receiverId: userId,
                status: 'pending',
            },
        });
        if (!invitation)
            throw new common_1.UnauthorizedException('No pending invitation found');
        return this.prisma.Friendship.update({
            where: { id: invitation.id },
            data: { status: 'rejected' },
        });
    }
    async deleteFriend(userId, friendId) {
        const friendship = await this.prisma.Friendship.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
                status: 'accepted',
            },
        });
        if (!friendship)
            throw new common_1.UnauthorizedException('No friend found to delete');
        return this.prisma.Friendship.delete({ where: { id: friendship.id } });
    }
    async blockFriend(userId, friendId) {
        const friendship = await this.prisma.Friendship.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
                status: 'accepted',
            },
        });
        if (!friendship)
            throw new common_1.UnauthorizedException('No friend found to block');
        return this.prisma.Friendship.update({
            where: { id: friendship.id },
            data: { status: 'blocked' },
        });
    }
    async enableAccount(userId) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.utilisateur.update({
            where: { id: userId },
            data: { status: 'enabled' },
        });
    }
    async disableAccount(userId) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.utilisateur.update({
            where: { id: userId },
            data: { status: 'disabled' },
        });
    }
    async uploadBanner(userId, file) {
        try {
            const bannerUrl = await this.fileUploadService.uploadFile(file, 'banners');
            await this.prisma.utilisateur.update({
                where: { id: userId },
                data: { bannerPhoto: bannerUrl }
            });
            return { url: bannerUrl };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload banner: ${error.message}`);
        }
    }
    async uploadProfile(userId, file) {
        try {
            const profileUrl = await this.fileUploadService.uploadFile(file, 'profiles');
            await this.prisma.utilisateur.update({
                where: { id: userId },
                data: { profilePhoto: profileUrl }
            });
            return { url: profileUrl };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload profile photo: ${error.message}`);
        }
    }
    async getTemporaryUploadUrl(fileType, uploadType) {
        try {
            const subfolder = uploadType === 'banner' ? 'banners' : 'profiles';
            return await this.fileUploadService.getTemporaryUploadUrl(fileType, subfolder);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to generate temporary upload URL: ${error.message}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map