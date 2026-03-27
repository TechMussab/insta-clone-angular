import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostDetailComponent } from '../components/post-details/post-detail.component';
import { Post, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostUiService {
  private dialog = inject(MatDialog);

  openDetail(post: Post, userProfile: User | null = null) {
    return this.dialog.open(PostDetailComponent, {
      data: { 
        post: post, 
        userProfile: userProfile 
      },
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      backdropClass: 'insta-backdrop'
    });
  }
}