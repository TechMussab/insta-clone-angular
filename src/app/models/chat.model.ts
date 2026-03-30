export interface Chat {
  id: string;
  participants?: string[];
  users?: string[];
  lastMessage?: string;
  timestamp?: number;
  otherUser?: {
    uid: string;
    username: string;
    profileImageUrl?: string;
    email?: string;
  };
}
