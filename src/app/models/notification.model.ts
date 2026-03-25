export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  fromUsername: string;
  postId?: string;
  timestamp: number;
}
