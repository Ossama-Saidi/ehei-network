import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    decodeToken(token: string): string | (() => string);
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        user: {
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
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
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
        };
        token: string;
    }>;
    private generateToken;
}
