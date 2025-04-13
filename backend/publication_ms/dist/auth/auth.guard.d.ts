import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export declare class AuthGuard implements CanActivate {
    private readonly userServiceClient;
    constructor(userServiceClient: ClientProxy);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
