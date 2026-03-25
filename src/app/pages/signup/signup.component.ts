import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white border border-gray-300">
        <div class="text-center">
          <h1 class="text-4xl font-serif mb-4">InstaClone</h1>
          <p class="text-gray-500 text-sm">Sign up to see photos from your friends.</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="Email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
          />
          <input
            type="text"
            [(ngModel)]="username"
            name="username"
            placeholder="Username"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
          />
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            placeholder="Password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
          />
          <textarea
            [(ngModel)]="bio"
            name="bio"
            placeholder="Bio (optional)"
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
            rows="3"
          ></textarea>
          @if (error()) {
            <p class="text-red-500 text-sm">{{ error() }}</p>
          }
          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading() ? 'Signing up...' : 'Sign Up' }}
          </button>
        </form>
        <div class="text-center">
          <p class="text-sm">
            Have an account?
            <a routerLink="/login" class="text-blue-500 font-semibold">Log in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  email = '';
  username = '';
  password = '';
  bio = '';
  isLoading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.isLoading.set(true);
    this.error.set('');
    try {
      await this.authService.signUp(this.email, this.password, this.username, this.bio);
    } catch (err: any) {
      this.error.set(err.message || 'Signup failed');
    } finally {
      this.isLoading.set(false);
    }
  }
}
