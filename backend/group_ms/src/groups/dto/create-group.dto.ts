import {GroupStatus} from '../enums/group-status.enum';

export class CreateGroupDto {
    name: string;
    description?: string;
    createdBy: number; 
    status: GroupStatus.ACTIVE;
    photoUrl?: string; // URL of the group's photo
    bannerUrl?: string; // URL of the group's banner
  }