import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Patch, 
  Delete,
  HttpException, 
  HttpStatus, 
  Query, 
  UseInterceptors,
  Param,
  Res,
  Req, 
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import * as fs from 'fs';
import * as path from 'path';
import { Audience } from '@prisma/client';
// import { UpdateAudienceDto } from './dto/audience.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
// import { UserCacheService } from '../users/user-cache.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createPublicationDto: CreatePublicationDto, 
    @CurrentUser() user
  ) {
    try {
      console.log(createPublicationDto);
      return await this.publicationService.createPublication(
        createPublicationDto,
        user.sub, // ✅ envoie l'id récupéré depuis le token vérifié
      );
    } catch (error) {
      // console.error('Error in createPublication:', error);
      throw new HttpException('Failed to create publication.', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      console.log(`Publication créée par l'utilisateur: ${user.email} ${user.sub}`);
    }
  }
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { 
        name: 'file', 
        maxCount: 1 
      }
    ])
  )
  async uploadImage(
    @UploadedFiles() files: { file?: MemoryStorageFile[] },
  ) {
    try {
      console.log('Upload method called, files:', files);
      const file = files?.file?.[0];
      if (!file) {
        console.error('No file uploaded');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
      // Optional: You could validate file details here
      if (file.size > MAX_FILE_SIZE) {
        throw new HttpException('File size exceeds 5MB limit', HttpStatus.BAD_REQUEST);
      }
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
      }
    // const uploadsDir = './public/uploads';  
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
      const extension = file.mimetype.split('/')[1]; // Ex: 'jpeg', 'png'
      const filename = `${timestamp}-${randomStr}.${extension}`;
      const filePath = path.join(uploadsDir, filename);
      console.log('File details:', {
        extension,
        filename,
        filePath,
        mimetype: file.mimetype,
        size: file.size
      });
    // Write file
    fs.writeFileSync(filePath, file.buffer);
    return {
      message: 'File uploaded successfully',
      imageUrl: `${filename}`
    };
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      error.message || 'Unexpected error during file upload', 
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );  
  }
}

// Solution pour requpere l'image upload
@Get('image/:imageName')
async getImage(@Param('imageName') imageName: string, @Res() res) {
  try {
    // Vérifiez si le nom de fichier contient des caractères dangereux
    if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
      throw new HttpException('Invalid file name', HttpStatus.BAD_REQUEST);
    }
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', imageName);
    
    // Vérifiez si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log(`Image not found: ${filePath}`);
      throw new HttpException('Image not found!', HttpStatus.NOT_FOUND);
    }
    
    // Déterminez le type MIME en fonction de l'extension
    let contentType = 'application/octet-stream';
    if (imageName.endsWith('.png')) contentType = 'image/png';
    if (imageName.endsWith('.jpg') || imageName.endsWith('.jpeg')) contentType = 'image/jpeg';
    if (imageName.endsWith('.gif')) contentType = 'image/gif';
    
    // Lisez le fichier en mémoire
    const fileBuffer = fs.readFileSync(filePath);
    
    // Définissez les headers et envoyez le buffer
    res.header('Content-Type', contentType);
    return res.send(fileBuffer);
  } catch (error) {
    console.error('Error serving image:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Error serving image', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
@Get('debug-uploads')
async debugUploads() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory path:', uploadsDir);
    
    // Vérifier si le dossier existe
    const dirExists = fs.existsSync(uploadsDir);
    
    // Lister les fichiers si le dossier existe
    const files = dirExists ? fs.readdirSync(uploadsDir) : [];
    
    return {
      workingDirectory: process.cwd(),
      uploadsPath: uploadsDir,
      directoryExists: dirExists,
      files: files
    };
  } catch (error) {
    console.error('Debug error:', error);
    return {
      error: error.message,
      stack: error.stack
    };
  }
}
  @Get()
  async consulterPublications() {
    try {
      // console.log("Endpoint /publication appelé");
      return await this.publicationService.consulterPublications();
    } catch (error) {
      // console.error('Error in consulterPublications:', error);
      throw new Error('Failed to fetch publications.');
    }
  }
  @Get(':id_publication')
  async consulterPublication(@Param('id_publication') id_publication: string) {
    try {
      return await this.publicationService.consulterPublication(id_publication);
    } catch (error) {
      console.error('Error fetching publication:', error);
      throw new Error('Failed to fetch publication.');
    }
  }

  // ----------- get tous publications d'un user -----------
  @Get('user/:userId')
  async getUserPublications(@Param('userId') userId: string) {
    try {
      return await this.publicationService.getUserPublications(Number(userId));
    } catch (error) {
      console.error('Error fetching user publications:', error);
      throw new HttpException(
        error.message || 'Failed to fetch user publications',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Get('searchtags')
  async searchPublicationsByTag(@Query('tag') tag:string) { 
    try {
      return await this.publicationService.searchPublicationsByTag(tag);
    } catch (error) {
      throw new HttpException('Failed to search publications by tag.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('cities')
  async getCities() {
    try {
      return await this.publicationService.getCities();
    } catch (error) {
      throw new HttpException('Failed to fetch cities.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('clubs')
  async getClubs() {
    try {
      return await this.publicationService.getClubs();
    } catch (error) {
      throw new HttpException('Failed to fetch clubs.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('emojis')
  async getEmojis() {
    try {
      return await this.publicationService.getEmojis();
    } catch (error) {
      throw new HttpException('Failed to fetch emojis.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('companies')
  async getCompanies() {
    try {
      return await this.publicationService.getCompanies();
    } catch (error) {
      throw new HttpException('Failed to fetch companies.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('emplois')
  async getEmplois() {
    try {
      return await this.publicationService.getEmplois();
    } catch (error) {
      throw new HttpException('Failed to fetch emplois.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('technologies')
  async getTechnologies() {
    try {
      return await this.publicationService.getTechnologies();
    } catch (error) {
      throw new HttpException('Failed to fetch technologies.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/audience')
  async updateAudience(
    @Param('id') id_publication: string,
    @Body() audienceData: { audience: Audience, id_user: number },
    // @Req() request
  ) {
    try {
      // console.log('Decoded User from Token:', request.user);
      // console.log('Received audience value:', audienceData.audience);
      // console.log('Existing publication:', id_publication);
      // const id_user = request.sub;

        // Récupérer l'id_user du body au lieu de request.user
        const id_user = audienceData.id_user;
        // Vérifier que id_user est bien fourni
        if (!id_user) {
          throw new HttpException({
            statusCode: 400,
            message: 'ID utilisateur manquant',
          }, HttpStatus.BAD_REQUEST);
        }
        console.log('User ID from request:', id_user);
        
      const updatedPublication = await this.publicationService.updatePublicationAudience(
        Number(id_publication),
        Number(id_user),
        audienceData.audience
      );
      return {
        statusCode: 200,
        message: 'Audience mise à jour avec succès',
        data: updatedPublication
      };
    } catch (error) {
      if (error.message === 'Publication not found') {
        throw new HttpException({
          statusCode: 404,
          message: error.message,
        }, HttpStatus.NOT_FOUND);
      } else if (error.message === 'User not authorized to modify this publication') {
        throw new HttpException({
          statusCode: 403,
          message: error.message,
        }, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException({
          statusCode: 500,
          message: 'Ops! ,Erreur lors de la mise à jour de l\'audience',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePublication(
    @Param('id') publicationId: string,
    @Req() request
  ) {
    try {
      // Assuming you have authentication middleware that adds user info to request
      const userId = request.user.sub; // Adjust based on your auth implementation
      
      return await this.publicationService.deletePublication(
        Number(publicationId),
        userId
      );
    } catch (error) {
      console.error('Error deleting publication:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete publication', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
