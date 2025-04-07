import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(credentials: LoginDto): Promise<{
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
    verifyJwt(data: {
        token: string;
    }): Promise<string | (() => string)>;
}
