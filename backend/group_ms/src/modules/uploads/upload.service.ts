// // // src/modules/upload/upload.service.ts
// // import { Injectable, BadRequestException } from '@nestjs/common';
// // import * as fs from 'fs';
// // import path, { join } from 'path';

// // @Injectable()
// // export class UploadService {
// //   async uploadBanner(file: Express.Multer.File): Promise<{ url: string }> {
// //     try {
// //       const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
// //       const filePath = join(process.cwd(), 'uploads', 'banners', fileName);
      
// //       // Save the file
// //       await fs.promises.writeFile(filePath, file.buffer);
      
// //       // Return a clean URL path (not a blob URL)
// //       const url = `/uploads/banners/${fileName}`;
// //       console.log('Generated banner URL:', url);
      
// //       return { url };
// //     } catch (error) {
// //       console.error('Error in uploadBanner:', error);
// //       throw new BadRequestException(`Failed to upload banner: ${error.message}`);
// //     }
// //   }
// //   async processBannerUrl(bannerUrl: string): Promise<{ url: string }> {
// //     // Remove any blob: URLs
// //     bannerUrl = bannerUrl.replace(/^blob:.*?\//, '');
    
// //     // Ensure it starts with /uploads/
// //     if (!bannerUrl.startsWith('/uploads/')) {
// //       bannerUrl = `/uploads/${bannerUrl}`;
// //     }
    
// //     return { url: bannerUrl };
// //   }
// // }

// // src/modules/upload/upload.service.ts
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { join } from 'path';
// import { existsSync, mkdirSync, writeFileSync } from 'fs';
// import { Express } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import { ConfigService } from '@nestjs/config'; // Make sure you have @nestjs/config installed

// @Injectable()
// export class UploadService {
//   private readonly frontendUrl: string;
//   private readonly backendUrl: string;
  
//   constructor(private configService: ConfigService) {
//     // Create upload directory if it doesn't exist
//     const bannerDir = join(process.cwd(), 'uploads', 'banners');
//     if (!existsSync(bannerDir)) {
//       mkdirSync(bannerDir, { recursive: true });
//     }
    
//     // Get URLs from environment or use defaults
//     this.frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
//     this.backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3002';
//   }

//   async uploadBanner(file: Express.Multer.File) {
//     try {
//       const fileName = `${uuidv4()}-${file.originalname}`;
//       const filePath = join(process.cwd(), 'uploads', 'banners', fileName);
      
//       // Save file to disk
//       writeFileSync(filePath, file.buffer);
      
//       // Return URL path that can be used to retrieve the file
//       // This should match the route in upload.controller.ts
//       const url = `/uploads/banners/${fileName}`;
      
//       console.log('Banner uploaded successfully:', url);
      
//       return {
//         url,
//         fileName
//       };
//     } catch (error) {
//       console.error('Upload banner error:', error);
//       throw new BadRequestException('Failed to upload banner');
//     }
//   }

//   async processBannerUrl(url: string) {
//     try {
//       // Remove any blob: prefixes or other client-side URLs
//       let cleanUrl = url.replace(/^blob:.*?\//, '');
      
//       // Handle case when URL is already a full URL (might be external)
//       if (cleanUrl.startsWith('http')) {
//         // For now, we'll just keep external URLs as is
//         // In a real implementation, you might want to download and process these
//         console.log('Processing external URL:', cleanUrl);
//         return { url: cleanUrl };
//       }
      
//       // Check if it's already a server URL that we've processed before
//       if (cleanUrl.startsWith('/uploads/banners/')) {
//         console.log('Already a valid banner URL path:', cleanUrl);
//         return { url: cleanUrl };
//       }
      
//       // If it's not a recognized path format, log a warning
//       console.warn('Unrecognized URL format for banner:', url);
      
//       // Return the cleaned URL as a fallback
//       return { url: cleanUrl };
//     } catch (error) {
//       console.error('Process banner URL error:', error);
//       throw new BadRequestException('Failed to process banner URL');
//     }
//   }
  
//   getFullBannerUrl(bannerUrl: string): string {
//     if (!bannerUrl) return null;
    
//     // Clean the URL of any blob prefixes
//     let cleanUrl = bannerUrl.replace(/^blob:.*?\//, '');
    
//     // If it's already a full URL, return it
//     if (cleanUrl.startsWith('http')) {
//       return cleanUrl;
//     }
    
//     // Ensure the URL starts with a slash for proper joining
//     if (!cleanUrl.startsWith('/')) {
//       cleanUrl = `/${cleanUrl}`;
//     }
    
//     // Use the frontend URL since that's where the client will be requesting from
//     const fullUrl = `${this.frontendUrl}${cleanUrl}`;
//     console.log('Transformed banner URL:', fullUrl);
    
//     return fullUrl;
//   }
// }