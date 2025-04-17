import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Reaction } from '@prisma/client';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsInt()
  id_publication: number;

  @IsNotEmpty()
  @IsInt()
  id_user: number;

  @IsNotEmpty()
  @IsEnum(Reaction)
  reaction: Reaction;
}

export class UpdateReactionDto {
  @IsNotEmpty()
  @IsEnum(Reaction)
  reaction: Reaction;
}