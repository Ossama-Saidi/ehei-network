// src/upload/upload.controller.ts
/*
import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    userService: any;

    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file) {
        return "upload success"
    }

    
    
 @Post('/uploadBanner')
 @UseGuards(AuthGuard('jwt'))
 @UseInterceptors(FileInterceptor('images')) // 'image' is the field name for the file
 async uploadBanner(@Req() req: Request, // Access the request object
 @UploadedFile() file: Express.Multer.File,) {
   try {
     if (!file) {
       throw new BadRequestException('No file uploaded');
     }
     const userId = req.user.id;
     const fileUrl = await this.userService.uploadBanner(userId, file);
     return { success: true, message: 'Banner uploaded successfully', url: fileUrl };
   } catch (error) {
     throw new BadRequestException(error.message);
   }
 }

 @Post('/uploadProfile')
 @UseGuards(AuthGuard('jwt'))
 @UseInterceptors(FileInterceptor('images')) // 'image' is the field name for the file
 async uploadProfile(@Req() req: Request,
 @UploadedFile() file: Express.Multer.File) {
   try {
     if (!file) {
       throw new BadRequestException('No file uploaded');
     }
     const userId = req.user.id;
     const fileUrl = await this.userService.uploadProfile(userId, file);
     return { success: true, message: 'Profile photo uploaded successfully', url: fileUrl };
   } catch (error) {
     throw new BadRequestException(error.message);
   }
 }
}*/