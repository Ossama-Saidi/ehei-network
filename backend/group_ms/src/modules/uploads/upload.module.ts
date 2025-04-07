// src/modules/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { multerOptions } from '../../shered/config/multer.config';
import { StorageService } from '../../shered/storage/storage.service';

@Module({
  imports: [
    MulterModule.register(multerOptions)
  ],
  controllers: [UploadController],
  providers: [UploadService, StorageService],
  exports: [UploadService]
})
export class UploadModule {}