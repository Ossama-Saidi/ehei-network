// src/modules/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { StorageService } from '../../shered/storage/storage.service';

@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}

  async uploadBanner(file: Express.Multer.File) {
    await this.storageService.ensureUploadsDir();
    
    return {
      filename: file.filename,
      path: `/uploads/banners/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    };
  }
}