import { Role } from "@prisma/client";
export declare class RegisterDto {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    password: string;
    role: Role;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ModifyUserDto {
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    bio?: string;
    profilePhoto?: string;
    bannerPhoto?: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
