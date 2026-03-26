import { Component, Input, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post, User, Comment } from '../../models';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc, collection, query, orderBy, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss'
})
export class PostItemComponent implements OnInit, OnDestroy {
  @Input({ required: true }) post!: Post;
  userProfile = signal<User | null>(null);
  comments = signal<Comment[]>([]);
  commentText = '';

  private firestore = inject(Firestore);
  private commentsUnsubscribe?: Unsubscribe;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Fetch the latest user profile data to ensure we show the current profile picture
    const userDoc = await getDoc(doc(this.firestore, 'users', this.post.userId));
    if (userDoc.exists()) {
      this.userProfile.set(userDoc.data() as User);
    }
    this.loadComments();
  }

  loadComments() {
    const commentsRef = collection(this.firestore, `posts/${this.post.id}/comments`);
    const q = query(commentsRef, orderBy('timestamp', 'asc'));
    
    this.commentsUnsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      this.comments.set(comments);
    });
  }

  isLiked() {
    const currentUser = this.authService.currentUser();
    return currentUser ? this.post.likedBy.includes(currentUser.uid) : false;
  }

  async toggleLike() {
    await this.postService.toggleLike(this.post.id);
  }

  async onAddComment() {
    if (!this.commentText.trim()) return;
    await this.postService.addComment(this.post.id, this.commentText);
    this.commentText = '';
  }

  ngOnDestroy() {
    if (this.commentsUnsubscribe) {
      this.commentsUnsubscribe();
    }
  }

  getTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
