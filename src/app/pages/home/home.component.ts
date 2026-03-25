import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { StoryBarComponent } from '../../components/story-bar/story-bar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostItemComponent, StoryBarComponent, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-2xl mx-auto pt-20 pb-8">
        <app-story-bar />
        @if (postService.isLoading()) {
          <div class="text-center py-8">Loading...</div>
        }
        @for (post of postService.posts(); track post.id) {
          <app-post-item [post]="post" />
        }
        @if (!postService.isLoading() && postService.posts().length === 0) {
          <div class="text-center py-8 text-gray-500">
            No posts yet. Follow some users to see their posts!
          </div>
        }
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.postService.loadFeed();
  }
}
