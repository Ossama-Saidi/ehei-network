import { PrismaService } from '../prisma/prisma.service';
import { ModifyUserDto } from 'src/auth/dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
export declare class UserService {
    private readonly prisma;
    private readonly userEventsClient;
    fileUploadService: any;
    constructor(prisma: PrismaService, userEventsClient: ClientProxy);
    getUserByEmail(email: string): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserById(userId: number): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        bio: string;
        profilePhoto: string;
        bannerPhoto: string;
    }>;
    updateUser(userId: number, updateData: ModifyUserDto): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    modify(userId: number, updateData: ModifyUserDto): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    sendFriendshipInvitation(senderId: number, receiverId: number): Promise<any>;
    acceptFriendship(userId: number, senderId: number): Promise<any>;
    rejectFriendship(userId: number, senderId: number): Promise<any>;
    deleteFriend(userId: number, friendId: number): Promise<any>;
    blockFriend(userId: number, friendId: number): Promise<any>;
    enableAccount(userId: number): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    disableAccount(userId: number): Promise<{
        id: number;
        nom: string;
        prenom: string;
        telephone: string;
        email: string;
        password: string;
        badge: boolean;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        bio: string | null;
        profilePhoto: string | null;
        bannerPhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadBanner(userId: number, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadProfile(userId: number, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    getTemporaryUploadUrl(fileType: string, uploadType: 'banner' | 'profile'): Promise<{
        url: string;
        fields: any;
    }>;
}
