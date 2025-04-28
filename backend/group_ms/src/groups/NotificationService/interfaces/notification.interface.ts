export interface NotificationPayload {
  type: NotificationType;
  userId: number;
  groupId?: number;
  groupName?: string;
  message: string;
  metadata?: Record<string, any>;
}

export enum NotificationType {
  GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST',
  GROUP_INVITATION = 'GROUP_INVITATION',
  POST_CREATED = 'POST_CREATED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED'
}