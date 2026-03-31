import { Component, Inject, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Firestore, collection, query, orderBy, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Post, Comment, User } from '../../models';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { TimeAgoPipe } from './time-ago.pipe';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatDialogModule, TimeAgoPipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit, OnDestroy {
  protected readonly comments = signal<Comment[]>([]);
  protected commentText = '';
  
  private readonly firestore = inject(Firestore);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  readonly data = inject<{ post: Post; userProfile: User | null }>(MAT_DIALOG_DATA);
  
  private commentsUnsubscribe?: Unsubscribe;

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

  isLiked() {
    const currentUser = this.authService.currentUser();
    return currentUser ? this.data.post.likedBy.includes(currentUser.uid) : false;
  }

  async toggleLike() {
    await this.postService.toggleLike(this.data.post.id);
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
}