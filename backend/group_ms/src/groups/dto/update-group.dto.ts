import { GroupStatus } from '../enums/group-status.enum';

export class UpdateGroupDto {
    name?: string;
    description?: string;
    status?: GroupStatus;
    photoUrl?: string;
    bannerUrl?: string;
  }
