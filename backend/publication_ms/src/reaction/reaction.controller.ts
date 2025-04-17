import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionService.create(createReactionDto);
  }

  @Get()
  findAll(@Query('publicationId') id_publication: string) {
    return this.reactionService.findAll(+id_publication);
  }

  @Get('user')
  findUserReaction(
    @Query('publicationId') id_publication: string,
    @Query('userId') id_user: string,
  ) {
    return this.reactionService.findUserReaction(+id_publication, +id_user);
  }

  @Get('stats/:id')
  getReactionStats(@Param('id') id: string) {
    return this.reactionService.getReactionStats(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionService.update(+id, updateReactionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.reactionService.remove(+id);
  }
}