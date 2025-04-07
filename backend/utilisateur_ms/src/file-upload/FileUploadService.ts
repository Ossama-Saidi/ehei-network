// import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class FileUploadService {
//   private readonly uploadDir: string;
//   private readonly baseUrl: string;

//   constructor(private configService: ConfigService) {
//     this.uploadDir = path.join(__dirname, '..', 'uploads');
//     this.baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3001/uploads';
//   }

//   /**
//    * Upload a file to the server
//    * @param file - The file to upload
//    * @param subfolder - Subfolder name (banners or profiles)
//    * @returns URL of the uploaded file
//    */
//   async uploadFile(file: Express.Multer.File, subfolder: string): Promise<string> {
//     try {
//       // Validate the file
//       this.validateFile(file);

//       // Ensure the upload directory exists
//       const uploadDir = this.getUploadDirectory(subfolder);

//       // Generate a unique filename
//       const uniqueFileName = this.generateUniqueFileName(file, subfolder);

//       // Save the file to the upload directory
//       const filePath = path.join(uploadDir, uniqueFileName);
//       await this.saveFile(file.buffer, filePath);

//       // Return the file URL
//       return this.getFileUrl(subfolder, uniqueFileName);
//     } catch (error) {
//       throw new BadRequestException(`Failed to upload file: ${error.message}`);
//     }
//   }

//   /**
//    * Generate a temporary URL for direct file uploads
//    * @param fileType - MIME type of the file
//    * @param subfolder - Subfolder name (banners or profiles)
//    * @returns Object containing the upload URL and fields
//    */
//   async getTemporaryUploadUrl(fileType: string, subfolder: string): Promise<{ url: string, fields: any }> {
//     try {
//       // Validate file type
//       const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//       if (!allowedMimeTypes.includes(fileType)) {
//         throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
//       }
      
//       // Generate a unique filename for the temporary URL
//       const fileName = `${subfolder}_${Date.now()}.${this.getExtensionFromMimeType(fileType)}`;
      
//       // Create a signed URL that expires after a certain time (e.g., 15 minutes)
//       const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes
      
//       // This is a simple implementation - in production, you might use AWS S3 presigned URLs
//       // or another cloud storage solution with proper authentication
//       const url = `${this.baseUrl}/api/upload/temp`;
      
//       // These fields would be used by the frontend to submit the file
//       const fields = {
//         key: `${subfolder}/${fileName}`,
//         'Content-Type': fileType,
//         expires: expirationTime,
//       };
      
//       return { url, fields };
//     } catch (error) {
//       throw new BadRequestException(`Failed to generate upload URL: ${error.message}`);
//     }
//   }

//   /**
//    * Validate that the file is allowed
//    * @param file - File to validate
//    */
//   private validateFile(file: Express.Multer.File): void {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     // Check file type (e.g., allow only images)
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
//     }
    
//     // Add file size validation
//     const maxSizeInBytes = 10 * 1024 * 1024; // 10MB (matching frontend validation)
//     if (file.size > maxSizeInBytes) {
//       throw new BadRequestException('File too large. Maximum file size is 10MB.');
//     }
//   }

//   /**
//    * Get or create the upload directory
//    * @param subfolder - Subfolder name
//    * @returns Path to the upload directory
//    */
//   private getUploadDirectory(subfolder: string): string {
//     const uploadDir = path.join(this.uploadDir, subfolder);

//     // Create the directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     return uploadDir;
//   }

//   /**
//    * Generate a unique filename
//    * @param file - File to generate name for
//    * @param subfolder - Subfolder name
//    * @returns Unique filename
//    */
//   private generateUniqueFileName(file: Express.Multer.File, subfolder: string): string {
//     const fileExtension = path.extname(file.originalname);
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 10);
//     return `${subfolder}_${timestamp}_${randomString}${fileExtension}`;
//   }

//   /**
//    * Save file to disk
//    * @param buffer - File buffer
//    * @param filePath - Path to save file
//    */
//  private async saveFile(buffer: Buffer, filePath: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       fs.writeFile(filePath, buffer, (err) => {
//         if (err) reject(err);
//         else resolve();
//       });
//     });
//   }

//   /**
//    * Get the public URL for a file
//    * @param subfolder - Subfolder name
//    * @param fileName - Filename
//    * @returns Public URL
//    */
//   private getFileUrl(subfolder: string, fileName: string): string {
//     return `${this.baseUrl}/uploads/${subfolder}/${fileName}`;
//   }
  
//   /**
//    * Convert MIME type to file extension
//    * @param mimeType - MIME type string
//    * @returns File extension
//    */
//  private getExtensionFromMimeType(mimeType: string): string {
//     const mimeToExt = {
//       'image/jpeg': 'jpg',
//       'image/png': 'png',
//       'image/gif': 'gif'
//     };
//     return mimeToExt[mimeType] || 'jpg';
//   }

/////////////////////////////////////////
/**
   * Upload file to server
   * @param file - Uploaded file
   * @param folder - Destination folder
   */
/**async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
  try {
    // Create folder if it doesn't exist
    const uploadPath = path.join(process.cwd(), 'public', folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    
    // Full path to save the file
    const fullPath = path.join(uploadPath, filename);
    
    // Save file
    fs.writeFileSync(fullPath, file.buffer);
    
    // Return URL to access the file
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3001';
    return `${baseUrl}/${folder}/${filename}`;
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Generate temporary URL for direct upload (for S3 or other cloud storage)
 * This is a placeholder - implement your cloud storage logic here
 */
/**async getTemporaryUploadUrl(fileType: string, subfolder: string): Promise<{ url: string, fields: any }> {
  // This would be implemented with actual cloud storage like S3
  // For now, return a placeholder
  return {
    url: 'http://example.com/upload',
    fields: {
      key: `${subfolder}/${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    },
  };
}*/

//}


//////////////////////////////////////////////

import { BadRequestException, Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(__dirname, '..', 'uploads');
    this.baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3001/uploads';
  }

  async uploadFile(file: Express.Multer.File, subfolder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateFile(file);
    const uploadDir = this.getUploadDirectory(subfolder);
    const uniqueFileName = this.generateUniqueFileName(file);
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return `${this.baseUrl}/${subfolder}/${uniqueFileName}`;
  }

  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File too large. Maximum size is 10MB.');
    }
  }

  private getUploadDirectory(subfolder: string): string {
    const dir = path.join(this.uploadDir, subfolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  private generateUniqueFileName(file: Express.Multer.File): string {
    const ext = path.extname(file.originalname);
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
  }
}


