import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: Timestamp;
}
