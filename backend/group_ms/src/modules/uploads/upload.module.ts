// // src/modules/upload/upload.module.ts
// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { UploadController } from './upload.controller';
// import { UploadService } from './upload.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
// import { memoryStorage } from 'multer';
// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     MulterModule.register({
//       storage: memoryStorage(),
//     }),
//     ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '..', '..', '..', 'uploads'), // Adjust path to point to uploads folder
//       serveRoot: '/uploads',
//       serveStaticOptions: {
//         index: false,
//         fallthrough: true,
//       },
//     }),
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//   ],
//   controllers: [UploadController],
//   providers: [UploadService],
//   exports: [UploadService],
// })
// export class UploadModule {}