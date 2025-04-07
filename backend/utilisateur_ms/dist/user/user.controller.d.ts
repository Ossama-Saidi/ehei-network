import { UserService } from './user.service';
import { Request } from 'express';
import { ChangePasswordDto, ModifyUserDto } from 'src/auth/dto/auth.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserProfileJwt(req: Request): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            nom: string;
            prenom: string;
            telephone: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            bio: string;
            profilePhoto: string;
            bannerPhoto: string;
        };
        message?: undefined;
    }>;
    getUserProfil(req: Request): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            nom: string;
            prenom: string;
            telephone: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            bio: string;
            profilePhoto: string;
            bannerPhoto: string;
        };
        message?: undefined;
    }>;
    getUserProfile(id: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            nom: string;
            prenom: string;
            telephone: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            bio: string;
            profilePhoto: string;
            bannerPhoto: string;
        };
        message?: undefined;
    }>;
    updateProfile(req: any, updateUserDto: ModifyUserDto): Promise<{
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
    getUser(email: string): Promise<{
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
    modify(req: Request, updateData: ModifyUserDto): Promise<{
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
    changePassword(req: Request, data: ChangePasswordDto): Promise<{
        message: string;
    }>;
    sendFriendshipInvitation(req: Request, receiverId: number): Promise<any>;
    acceptFriendship(req: Request, senderId: number): Promise<any>;
    rejectFriendship(req: Request, senderId: number): Promise<any>;
    deleteFriend(req: Request, friendId: number): Promise<any>;
    blockFriend(req: Request, friendId: number): Promise<any>;
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
    uploadBanner(req: Request, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        url: {
            url: string;
        };
    }>;
    uploadProfile(req: Request, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        url: {
            url: string;
        };
    }>;
}
