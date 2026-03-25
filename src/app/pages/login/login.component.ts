import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white border border-gray-300">
        <div class="text-center">
          <h1 class="text-4xl font-serif mb-8">InstaClone</h1>
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
            type="password"
            [(ngModel)]="password"
            name="password"
            placeholder="Password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
          />
          @if (error()) {
            <p class="text-red-500 text-sm">{{ error() }}</p>
          }
          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading() ? 'Logging in...' : 'Log In' }}
          </button>
        </form>
        <div class="text-center">
          <p class="text-sm">
            Don't have an account?
            <a routerLink="/signup" class="text-blue-500 font-semibold">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
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
      await this.authService.signIn(this.email, this.password);
    } catch (err: any) {
      this.error.set(err.message || 'Login failed');
    } finally {
      this.isLoading.set(false);
    }
  }
}
