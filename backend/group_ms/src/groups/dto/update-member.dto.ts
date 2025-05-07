import { Role } from "@prisma/client";
import { IsIn, IsNumber } from "class-validator";

export class updateMemberDto {
  @IsNumber()
  userId: number;

  @IsIn(['ADMIN', 'MODERATOR', 'MEMBER']) // Use IsIn instead of IsEnum for validation
  role: Role;
}