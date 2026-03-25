import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white border border-gray-300 mb-4">
      <div class="flex items-center justify-between p-3">
        <div class="flex items-center gap-3">
          <img
            [src]="post.profileImage || 'https://via.placeholder.com/32'"
            alt="Profile"
            class="w-8 h-8 rounded-full"
          />
          <a [routerLink]="['/profile', post.userId]" class="font-semibold text-sm">
            {{ post.username }}
          </a>
        </div>
      </div>
      <img [src]="post.postImage" alt="Post" class="w-full" />
      <div class="p-3">
        <div class="flex gap-4 mb-3">
          <button (click)="toggleLike()" class="hover:opacity-70">
            <svg
              class="w-7 h-7"
              [class.fill-red-500]="isLiked()"
              [class.stroke-red-500]="isLiked()"
              [class.fill-none]="!isLiked()"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button class="hover:opacity-70">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
        <p class="font-semibold text-sm mb-2">{{ post.likedBy.length }} likes</p>
        <p class="text-sm">
          <a [routerLink]="['/profile', post.userId]" class="font-semibold">{{ post.username }}</a>
          {{ post.caption }}
        </p>
        <p class="text-gray-500 text-xs mt-2">{{ getTimeAgo(post.timestamp) }}</p>
      </div>
    </div>
  `
})
export class PostItemComponent {
  @Input({ required: true }) post!: Post;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

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
