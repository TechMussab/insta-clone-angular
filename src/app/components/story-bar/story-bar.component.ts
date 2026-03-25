import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Story } from '../../models';

@Component({
  selector: 'app-story-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-bar.component.html',
  styleUrl: './story-bar.component.scss'
})
export class StoryBarComponent implements OnInit, OnDestroy {
  stories = signal<Story[]>([]);
  private storyUnsubscribe?: Unsubscribe;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadStories();
  }

  ngOnDestroy() {
    // Cleanup the listener when the component is destroyed
    if (this.storyUnsubscribe) this.storyUnsubscribe();
  }

  loadStories() {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const storiesQuery = query(
      collection(this.firestore, 'stories'),
      where('timestamp', '>', twentyFourHoursAgo)
    );

    this.storyUnsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Story));
      this.stories.set(stories);
    });
  }
}
