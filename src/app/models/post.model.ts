import { Timestamp } from '@angular/fire/firestore';

export interface Post {
  id: string;
  userId: string;
  username: string;
  profileImage?: string;
  postImage: string;
  caption: string;
  likedBy: string[];
  timestamp: Timestamp;
}
