import { Module } from '@nestjs/common';
import { FileUploadService } from './FileUploadService';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
          rootPath: path.join(__dirname, '..', 'public'),
        }),
      ,
    // Configure Multer for file uploads
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(__dirname, '..', 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExtension = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 5 MB file size limit
      },
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
