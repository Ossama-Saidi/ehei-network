import { Socket, Server } from 'socket.io';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { JwtService } from '@nestjs/jwt';
export declare class PublicationGateway {
    private readonly publicationService;
    private readonly jwtService;
    server: Server;
    constructor(publicationService: PublicationService, jwtService: JwtService);
    handleCreatePublication(createPublicationDto: CreatePublicationDto, client: Socket): Promise<void>;
}
