import { Injectable, signal } from '@angular/core';
import { Firestore, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, arrayUnion, arrayRemove, getDocs } from '@angular/fire/firestore';
import { Post, Comment } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = signal<Post[]>([]);
  isLoading = signal(false);

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  async loadFeed() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.isLoading.set(true);

    // Get following list
    const followsQuery = query(
      collection(this.firestore, 'follows'),
      where('followerId', '==', currentUser.uid)
    );
    const followsSnapshot = await getDocs(followsQuery);
    const followingIds = followsSnapshot.docs.map(doc => doc.data()['followingId']);
    followingIds.push(currentUser.uid); // Include own posts

    // Get posts from followed users
    const postsQuery = query(
      collection(this.firestore, 'posts'),
      where('userId', 'in', followingIds.slice(0, 10)), // Firestore 'in' limit is 10
      orderBy('timestamp', 'desc')
    );

    onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      this.posts.set(posts);
      this.isLoading.set(false);
    });
  }

  async createPost(postImage: string, caption: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const post: Omit<Post, 'id'> = {
      userId: currentUser.uid,
      username: currentUser.username,
      profileImage: currentUser.profileImageUrl,
      postImage,
      caption,
      likedBy: [],
      timestamp: Date.now()
    };

    await addDoc(collection(this.firestore, 'posts'), post);
  }

  async toggleLike(postId: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const postRef = doc(this.firestore, 'posts', postId);
    const post = this.posts().find(p => p.id === postId);

    if (post?.likedBy.includes(currentUser.uid)) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(currentUser.uid)
      });
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(currentUser.uid)
      });
    }
  }

  async addComment(postId: string, text: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const comment: Omit<Comment, 'id'> = {
      userId: currentUser.uid,
      username: currentUser.username,
      profileImage: currentUser.profileImageUrl,
      text,
      timestamp: Date.now()
    };

    await addDoc(collection(this.firestore, `posts/${postId}/comments`), comment);
  }
}
