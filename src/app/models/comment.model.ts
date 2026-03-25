export interface Comment {
  id: string;
  userId: string;
  username: string;
  profileImage?: string;
  text: string;
  timestamp: number;
}
