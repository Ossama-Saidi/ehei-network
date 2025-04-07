// audience.dto.ts
import { IsEnum } from 'class-validator';
import { Audience } from '@prisma/client';

export class UpdateAudienceDto {
  @IsEnum(Audience)
  audience: Audience;
}