import { ConfigService } from '@nestjs/config';
export declare class FileUploadService {
    private configService;
    private readonly uploadDir;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, subfolder: string): Promise<string>;
    private validateFile;
    private getUploadDirectory;
    private generateUniqueFileName;
}
