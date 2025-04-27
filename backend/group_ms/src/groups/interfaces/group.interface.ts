export interface Group {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  privacy: 'PUBLIC' | 'PRIVATE';
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  members?: Member[];
}

export interface Member {
  id: number;
  userId: number;
  groupId: number;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
}

export interface GroupMemberResponse {
  userId: number;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  user: {
    nom: string;
    prenom: string;
    email: string;
    profilePhoto?: string;
  };
}