import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        role: any;
    }>;
}
export {};
