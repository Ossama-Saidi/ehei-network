import { Role } from "@prisma/client";

export class RegisterDto {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  password: string;
  role: Role;
}

export class LoginDto {
  email: string;
  password: string;
}

export class ModifyUserDto {
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  bio?: string;
  profilePhoto?: string;
  bannerPhoto?: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}