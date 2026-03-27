import { Component, Input, signal, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post, User } from '../../models';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostDetailComponent } from '../post-details/post-detail.component';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatDialogModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PostItemComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  userProfile = signal<User | null>(null);

  private firestore = inject(Firestore);
  private dialog = inject(MatDialog);

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
  }

  openPostDetail() {
    this.dialog.open(PostDetailComponent, {
      data: { 
        post: this.post, 
        userProfile: this.userProfile() 
      },
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      backdropClass: 'insta-backdrop'
    });
  }

  isLiked() {
    const currentUser = this.authService.currentUser();
    return currentUser ? this.post.likedBy.includes(currentUser.uid) : false;
  }

  async toggleLike() {
    await this.postService.toggleLike(this.post.id);
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
