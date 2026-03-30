import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Firestore, doc, getDoc, collection, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { User, Post } from '../../models';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private firestore = inject(Firestore);
  public authService = inject(AuthService);
  private chatService = inject(ChatService);
  private router = inject(Router);

  username = signal('');
  bio = signal('');
  profileImageUrl = signal('');
  postCount = signal(0);
  followerCount = signal(0);
  followingCount = signal(0);
  posts = signal<Post[]>([]);
  currentProfileUserId = signal('');

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.loadProfile(userId);
      }
    });
  }

  async loadProfile(userId: string) {
    this.currentProfileUserId.set(userId);

    // 1. Load User Data
    const userDoc = await getDoc(doc(this.firestore, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      this.username.set(userData.username);
      this.bio.set(userData.bio || '');
      this.profileImageUrl.set(userData.profileImageUrl || '');
    }

    // 2. Load User's Posts (requires index for userId + timestamp)
    const postsQuery = query(
      collection(this.firestore, 'posts'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const postsSnapshot = await getDocs(postsQuery);
    const userPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    this.posts.set(userPosts);
    this.postCount.set(userPosts.length);

    // 3. Load Follower/Following Counts from 'follows' collection
    const followersQuery = query(collection(this.firestore, 'follows'), where('followingId', '==', userId));
    const followersSnapshot = await getDocs(followersQuery);
    this.followerCount.set(followersSnapshot.size);

    const followingQuery = query(collection(this.firestore, 'follows'), where('followerId', '==', userId));
    const followingSnapshot = await getDocs(followingQuery);
    this.followingCount.set(followingSnapshot.size);
  }

  isOwnProfile(): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.uid === this.currentProfileUserId();
  }

  async openChat() {
    const chatId = await this.chatService.createChat(this.currentProfileUserId());
    this.router.navigate(['/chat', chatId]);
  }
}
