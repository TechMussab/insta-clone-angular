import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
