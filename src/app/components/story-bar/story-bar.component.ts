import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, onSnapshot } from '@angular/fire/firestore';
import { Story } from '../../models';

@Component({
  selector: 'app-story-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-300 p-4 mb-4 overflow-x-auto">
      <div class="flex gap-4">
        @for (story of stories(); track story.id) {
          <div class="flex flex-col items-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
              <img
                [src]="story.image"
                alt="Story"
                class="w-full h-full rounded-full border-2 border-white object-cover"
              />
            </div>
            <p class="text-xs mt-1 truncate w-16 text-center">{{ story.username }}</p>
          </div>
        }
        @if (stories().length === 0) {
          <p class="text-gray-500 text-sm">No stories available</p>
        }
      </div>
    </div>
  `
})
export class StoryBarComponent implements OnInit {
  stories = signal<Story[]>([]);

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadStories();
  }

  loadStories() {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const storiesQuery = query(
      collection(this.firestore, 'stories'),
      where('timestamp', '>', twentyFourHoursAgo)
    );

    onSnapshot(storiesQuery, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Story));
      this.stories.set(stories);
    });
  }
}
