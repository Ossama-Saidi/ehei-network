import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Audience } from '@prisma/client';

export class CreatePublicationDto {
  // @IsInt()
  // @IsNotEmpty()
  // id_user: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString({ each: true }) // For array of strings
  tags?: string[];

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  entreprise?: string;

  @IsOptional()
  @IsString()
  typeEmploi?: string;

  @IsOptional()
  @IsString()
  technologie?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsEnum(Audience)
  audience?: Audience;
}
