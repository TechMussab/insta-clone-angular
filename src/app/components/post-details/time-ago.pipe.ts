import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: number | Timestamp | undefined | null): string {
    let milliseconds: number;

    if (value instanceof Timestamp) {
      milliseconds = value.toMillis();
    } else if (typeof value === 'number') {
      milliseconds = value;
    } else return ''; // Handle undefined/null timestamps

    const seconds = Math.floor((Date.now() - milliseconds) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}