import {
  Controller, Post, Body, Param, Delete, Put, Get, UseGuards
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':publicationId')
  @UseGuards(AuthGuard)
  createComment(
    @Param('publicationId') publicationId: number,
    @Body('contenu') contenu: string,
    @CurrentUser() user,
  ) {
    return this.commentService.createComment(Number(publicationId), contenu, user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateComment(
    @Param('id') id: number,
    @Body('contenu') contenu: string,
    @CurrentUser() user,
  ) {
    return this.commentService.updateComment(Number(id), contenu, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteComment(@Param('id') id: number, @CurrentUser() user) {
    return this.commentService.deleteComment(Number(id), user.sub);
  }

  @Get('publication/:publicationId')
  getComments(@Param('publicationId') publicationId: number) {
    return this.commentService.getCommentsByPublication(Number(publicationId));
  }
  @Get('stats/counts')
  async getCounts() {
    return this.commentService.getCounts();
  }

}
