import { Controller, Post,Put, Get,Patch,NotFoundException ,HttpException, HttpStatus, Body, Param, UseGuards, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('messages')
export class MessagesController {
  messageService: any;
  constructor(private readonly messagesService: MessagesService) {}

  // Route pour envoyer un message
  @Post('send')
@UseGuards(AuthGuard)
async sendMessage(
  @Body('senderId') senderId: string,
  @Body('receiverId') receiverId: string,
  @Body('content') content: string,
  @Body('type') type: string,
   
) {
  const message = await this.messagesService.sendMessage(senderId, receiverId, content, type,);

  if (message) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Message created successfully',
      data: message,
    };
  } else {
    throw new HttpException('Message not created', HttpStatus.BAD_REQUEST);
  }
}


@Post('send-file')
@UseGuards(AuthGuard)
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // 📂 Dossier où les fichiers seront stockés
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async sendFileMessage(
  @UploadedFile() file: Express.Multer.File,
  @Body('senderId') senderId: string,
  @Body('receiverId') receiverId: string,
) {
  if (!file) {
    throw new HttpException('Aucun fichier envoyé', HttpStatus.BAD_REQUEST);
  }

  const fileUrl = `/uploads/${file.filename}`;

  const message = await this.messagesService.sendMessage(
    senderId,
    receiverId,
    fileUrl,
    'file', // 🔑 Le type ici est 'file'
  );

  return {
    statusCode: HttpStatus.CREATED,
    message: 'Fichier envoyé avec succès',
    data: message,
  };
}


 // Route pour récupérer les messages d'un utilisateur
@Get('conversation/:senderId/:receiverId')
@UseGuards(AuthGuard) 
async getMessagesBetweenUsers(
  @Param('senderId') senderId: string,
  @Param('receiverId') receiverId: string,
): Promise<{ status: string; data?: Message[] }> {
  const messages = await this.messagesService.getMessagesBetweenUsers(senderId, receiverId);
  if (messages.length > 0) {
    return { status: 'OK', data: messages };
  }
  return { status: 'NOT_FOUND' };
}



@Put('update/:messageId/:senderId')
@UseGuards(AuthGuard) 
async updateMessageBySender(
  @Param('messageId') messageId: string,
  @Param('senderId') senderId: string,
  @Body() updateData: { content?: string; type?: string }
): Promise<{ status: string; data?: Message }> {
  const updatedMessage = await this.messagesService.updateMessageBySender(messageId, senderId, updateData);
  
  if (updatedMessage) {
    return { status: 'OK', data: updatedMessage };
  }

  throw new HttpException({ status: 'BAD_REQUEST', message: 'Message non modifié' }, HttpStatus.BAD_REQUEST);
}

  
  



  // Recherche de messages par contenu
   // Recherche de messages par contenu
   @Post('searchByContent')
   @UseGuards(AuthGuard) 
async searchMessagesByContent(@Body() body: { content: string }) {
  const messages = await this.messagesService.searchMessagesByContent(body.content);

  if (messages.length === 0) {
    // Si aucun message n'est trouvé, renvoyer une erreur 404
    throw new HttpException(
      { message: 'Aucun message trouvé' },
      HttpStatus.NO_CONTENT,
    );
  }

  // Si des messages sont trouvés, renvoyer une réponse avec le statut 200
  return {
    statusCode: HttpStatus.FOUND,  // Explicitement définir le statut 200
    message: 'Messages trouvés',
    data: messages
  };
}

   @Patch('archive/:id')
   @UseGuards(AuthGuard) 
   async archiveMessage(@Param('id') id: string) {
     const message = await this.messagesService.archiveMessage(Number(id));
 
     if (!message) {
       throw new HttpException('Message non trouvé', HttpStatus.NOT_FOUND);
     }
 
     return { 
      statusCode: HttpStatus.OK,
      message: 'Message archivé avec succès', data: message };
   }

   @Patch('hide/:id') 
@UseGuards(AuthGuard) 
async hideMessage(@Param('id') id: string) {
  const message = await this.messagesService.hideMessage(Number(id));

  if (!message) {
    throw new NotFoundException('Message non trouvé');
  }

  return { 
    statusCode: HttpStatus.OK,
    message: 'Message caché avec succès', 
    data: message 
  };
}

@Get('last-message/:senderId/:receiverId')
@UseGuards(AuthGuard)
async getLastMessageBetweenUsers(
  @Param('senderId') senderId: string,
  @Param('receiverId') receiverId: string,
): Promise<{ status: string; data?: Message }> {
  const lastMessage = await this.messagesService.getLastMessageBetweenUsers(senderId, receiverId);

  if (lastMessage) {
    return {
      status: 'OK',
      data: lastMessage,
    };
  }

  return {
    status: 'NOT_FOUND',
     
  };
}

 

}