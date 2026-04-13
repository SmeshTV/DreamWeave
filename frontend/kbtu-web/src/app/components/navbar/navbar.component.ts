import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn = false;
  username: string | null = null;
  private authSubscription!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.updateAuthState();
    this.authSubscription = this.auth.isAuth$.subscribe(() => {
      this.updateAuthState();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateAuthState(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.username = this.auth.getUsername();
  }

  onLogout(): void {
    this.auth.logout();
    this.updateAuthState();
  }
}
