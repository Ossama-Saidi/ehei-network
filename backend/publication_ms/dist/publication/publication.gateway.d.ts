import { Socket, Server } from 'socket.io';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
export declare class PublicationGateway {
    private readonly publicationService;
    server: Server;
    constructor(publicationService: PublicationService);
    handleCreatePublication(createPublicationDto: CreatePublicationDto, client: Socket): Promise<void>;
}
