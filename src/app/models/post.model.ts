export interface Post {
  id: string;
  userId: string;
  username: string;
  profileImage?: string;
  postImage: string;
  caption: string;
  likedBy: string[];
  timestamp: number;
}
