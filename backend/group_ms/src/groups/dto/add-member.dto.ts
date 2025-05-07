export class AddMemberDto {
    userId: number;
    role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  }