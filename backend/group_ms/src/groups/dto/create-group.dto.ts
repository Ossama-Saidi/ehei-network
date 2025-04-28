import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  privacy?: 'PUBLIC' | 'PRIVATE' = 'PUBLIC';

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  createdBy?: number;
}
