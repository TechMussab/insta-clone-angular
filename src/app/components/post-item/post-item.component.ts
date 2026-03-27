import { Component, Input, signal, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post, User } from '../../models';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { PostUiService } from '../../services/post-ui.service';
import { TimeAgoPipe } from '../post-details/time-ago.pipe';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatDialogModule, TimeAgoPipe],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PostItemComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  userProfile = signal<User | null>(null);

  private firestore = inject(Firestore);
  private postUiService = inject(PostUiService);

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
    this.postUiService.openDetail(this.post, this.userProfile());
  }

  isLiked() {
    const currentUser = this.authService.currentUser();
    return currentUser ? this.post.likedBy.includes(currentUser.uid) : false;
  }

  async toggleLike() {
    await this.postService.toggleLike(this.post.id);
  }
}
