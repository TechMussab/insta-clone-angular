import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
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
