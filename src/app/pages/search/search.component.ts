import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Firestore, collection, query, where, getDocs, limit } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchQuery = '';
  filteredUsers = signal<User[]>([]);

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async onSearch() {
    const queryText = this.searchQuery.trim();
    
    if (!queryText) {
      this.filteredUsers.set([]);
      return;
    }

    // Perform a prefix search logic similar to the Android version
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('username', '>=', queryText),
      where('username', '<=', queryText + '\uf8ff'),
      limit(20)
    );

    const querySnapshot = await getDocs(q);
    const currentUserId = this.authService.currentUser()?.uid;

    const users = querySnapshot.docs
      .map(doc => doc.data() as User)
      .filter(user => user.uid !== currentUserId); // Don't show yourself in search

    this.filteredUsers.set(users);
  }
}
