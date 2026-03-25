import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { Firestore, collection, query, where, getDocs, limit, orderBy } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { User, Post } from '../../models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  filteredUsers = signal<User[]>([]);
  filteredPosts = signal<Post[]>([]);

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadExplorePosts();
  }

  async loadExplorePosts() {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(30));
    const querySnapshot = await getDocs(q);
    this.filteredPosts.set(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
  }

  async onSearch() {
    const queryText = this.searchQuery.trim();
    
    if (!queryText) {
      this.filteredUsers.set([]);
      this.loadExplorePosts();
      return;
    }

    // 1. Search Users (Prefix match)
    const usersRef = collection(this.firestore, 'users');
    const userQuery = query(
      usersRef,
      where('username', '>=', queryText),
      where('username', '<=', queryText + '\uf8ff'),
      limit(20)
    );

    const userSnapshot = await getDocs(userQuery);
    const currentUserId = this.authService.currentUser()?.uid;

    const users = userSnapshot.docs
      .map(doc => doc.data() as User)
      .filter(user => user.uid !== currentUserId); // Don't show yourself in search

    this.filteredUsers.set(users);

    // 2. Search Posts related to that user (Prefix match on username field in posts)
    const postsRef = collection(this.firestore, 'posts');
    const postQuery = query(
      postsRef,
      where('username', '>=', queryText),
      where('username', '<=', queryText + '\uf8ff'),
      limit(24)
    );

    const postSnapshot = await getDocs(postQuery);
    this.filteredPosts.set(postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
  }
}
