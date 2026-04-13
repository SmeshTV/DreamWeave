import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode = true;
  username = '';
  email = '';
  password = '';
  passwordConfirm = '';
  error: string | null = null;
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit(): void {
    this.error = null;
    this.loading = true;
    this.cdr.detectChanges();

    if (this.isLoginMode) {
      this.api.login(this.username, this.password).subscribe({
        next: (tokens) => {
          this.auth.login(tokens);
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 0) {
            this.error = 'Cannot connect to backend. Make sure server is running on port 8000.';
          } else {
            this.error = err.error?.detail || 'Invalid username or password';
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.api.register(this.username, this.email, this.password, this.passwordConfirm).subscribe({
        next: () => {
          this.isLoginMode = true;
          this.loading = false;
          this.error = 'Registration successful! Please login.';
          this.password = '';
          this.passwordConfirm = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 0) {
            this.error = 'Cannot connect to backend. Make sure server is running on port 8000.';
          } else {
            const errors = err.error;
            if (typeof errors === 'object') {
              this.error = Object.values(errors).flat().join('\n');
            } else {
              this.error = errors || 'Registration failed';
            }
          }
          this.cdr.detectChanges();
        }
      });
    }
  }
}
