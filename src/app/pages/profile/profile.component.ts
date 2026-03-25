import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-4xl mx-auto pt-20 pb-8 px-4">
        <div class="flex items-center gap-8 mb-8">
          <img
            [src]="profileImageUrl() || 'https://via.placeholder.com/150'"
            alt="Profile"
            class="w-32 h-32 rounded-full"
          />
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-4">
              <h1 class="text-2xl font-light">{{ username() }}</h1>
              <button class="px-4 py-1 bg-blue-500 text-white rounded font-semibold text-sm">
                Follow
              </button>
            </div>
            <div class="flex gap-8 mb-4">
              <span><strong>{{ postCount() }}</strong> posts</span>
              <span><strong>{{ followerCount() }}</strong> followers</span>
              <span><strong>{{ followingCount() }}</strong> following</span>
            </div>
            <p class="text-sm">{{ bio() }}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-1">
          @for (post of posts(); track post.id) {
            <div class="aspect-square bg-gray-200">
              <img [src]="post.postImage" alt="Post" class="w-full h-full object-cover" />
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  username = signal('');
  bio = signal('');
  profileImageUrl = signal('');
  postCount = signal(0);
  followerCount = signal(0);
  followingCount = signal(0);
  posts = signal<any[]>([]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    // TODO: Load user profile data
    console.log('Loading profile for user:', userId);
  }
}
