import { Component, Inject, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Firestore, collection, query, orderBy, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Post, Comment, User } from '../../models';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatDialogModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit, OnDestroy {
  comments = signal<Comment[]>([]);
  commentText = '';
  
  private firestore = inject(Firestore);
  private postService = inject(PostService);
  private commentsUnsubscribe?: Unsubscribe;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { post: Post; userProfile: User | null }
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    const commentsRef = collection(this.firestore, `posts/${this.data.post.id}/comments`);
    const q = query(commentsRef, orderBy('timestamp', 'asc'));
    
    this.commentsUnsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      this.comments.set(comments);
    });
  }

  async onAddComment() {
    if (!this.commentText.trim()) return;
    await this.postService.addComment(this.data.post.id, this.commentText);
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