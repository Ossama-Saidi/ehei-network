// // src/modules/upload/upload.controller.ts
// import { 
//   Controller, 
//   Post, 
//   UploadedFile, 
//   UseInterceptors, 
//   BadRequestException, 
//   Get, 
//   Param, 
//   Res, 
//   NotFoundException 
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UploadService } from './upload.service';
// import { UploadFileDto } from './dto/upload-file.dto';
// import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Express } from 'express';
// import { memoryStorage } from 'multer';
// import { join } from 'path';
// import { existsSync } from 'fs';
// import { Response } from 'express';

// @ApiTags('Uploads')
// @Controller('uploads')
// export class UploadController {
//   constructor(private readonly uploadService: UploadService) {}

//   @Post('banner')
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Banner image upload',
//     type: UploadFileDto,
//   })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),
//       limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB
//       },
//       fileFilter: (req, file, callback) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//           return callback(new BadRequestException('Only image files are allowed!'), false);
//         }
//         callback(null, true);
//       },
//     }),
//   )
//   async uploadBanner(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }
//     return this.uploadService.uploadBanner(file);
//   }

//   @Get('banners/:filename')
//   async getBanner(@Param('filename') filename: string, @Res() res: Response) {
//     try {
//       const bannersDir = join(process.cwd(), 'uploads', 'banners');
//       const filePath = join(bannersDir, filename);
      
//       console.log('Requested banner path:', filePath);
//       console.log('File exists:', existsSync(filePath));

//       if (!existsSync(filePath)) {
//         throw new NotFoundException('Banner not found');
//       }

//       return res.sendFile(filePath);
//     } catch (error) {
//       console.error('Error serving banner:', error);
//       throw new NotFoundException('Banner not found');
//     }
//   }
// }

// src/modules/upload/upload.controller.ts
// import { 
//   Controller, 
//   Post, 
//   UploadedFile, 
//   UseInterceptors, 
//   BadRequestException, 
//   Get, 
//   Param, 
//   Res, 
//   NotFoundException,
//   Body 
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UploadService } from './upload.service';
// import { UploadFileDto } from './dto/upload-file.dto';
// import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Express } from 'express';
// import { memoryStorage } from 'multer';
// import { join } from 'path';
// import { existsSync } from 'fs';
// import { Response } from 'express';

// @ApiTags('Uploads')
// @Controller('uploads')  // Remove the 'uploads' prefix here to match the frontend URL pattern
// export class UploadController {
//   constructor(private readonly uploadService: UploadService) {}

//   @Post('uploads')  // Add the 'uploads' prefix to the route instead
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Banner image upload',
//     type: UploadFileDto,
//   })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),
//       limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB
//       },
//       fileFilter: (req, file, callback) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//           return callback(new BadRequestException('Only image files are allowed!'), false);
//         }
//         callback(null, true);
//       },
//     }),
//   )
//   async uploadBanner(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }
//     return this.uploadService.uploadBanner(file);
//   }

//   @Post('uploads/process-banner-url')  // Add the 'uploads' prefix here as well
//   async processBannerUrl(@Body() body: { url: string }) {
//     if (!body.url) {
//       throw new BadRequestException('No URL provided');
//     }
//     return this.uploadService.processBannerUrl(body.url);
//   }

//   @Get('banners/:filename')  // Match the URL pattern that the frontend is using
//   async getBanner(@Param('filename') filename: string, @Res() res: Response) {
//     try {
//       const bannersDir = join(process.cwd(), 'uploads', 'banners');
//       const filePath = join(bannersDir, filename);
      
//       console.log('Requested banner path:', filePath);
//       console.log('File exists:', existsSync(filePath));

//       if (!existsSync(filePath)) {
//         throw new NotFoundException('Banner not found');
//       }

//       return res.sendFile(filePath);
//     } catch (error) {
//       console.error('Error serving banner:', error);
//       throw new NotFoundException('Banner not found');
//     }
//   }
// }