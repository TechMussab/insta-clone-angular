import { Timestamp } from '@angular/fire/firestore';

export interface Chat {
  id: string;
  participants?: string[];
  users?: string[];
  lastMessage?: string;
  timestamp?: Timestamp;
  otherUser?: {
    uid: string;
    username: string;
    profileImageUrl?: string;
    email?: string;
  };
}
