import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-2xl mx-auto pt-20 pb-8 px-4">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Search users..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <div class="mt-4">
          @for (user of filteredUsers(); track user.uid) {
            <div class="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
              <img
                [src]="user.profileImageUrl || 'https://via.placeholder.com/40'"
                alt="Profile"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <p class="font-semibold">{{ user.username }}</p>
                <p class="text-sm text-gray-500">{{ user.bio }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SearchComponent {
  searchQuery = '';
  filteredUsers = signal<any[]>([]);

  onSearch() {
    // TODO: Implement Firestore search
    console.log('Searching for:', this.searchQuery);
  }
}
