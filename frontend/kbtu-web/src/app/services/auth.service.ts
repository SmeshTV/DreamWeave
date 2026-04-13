import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthTokens } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken = new BehaviorSubject<string | null>(null);
  private refreshToken = new BehaviorSubject<string | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadTokens();
  }

  private loadTokens(): void {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access && refresh) {
      this.accessToken.next(access);
      this.refreshToken.next(refresh);
      this.isAuthenticated.next(true);
    }
  }

  login(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    this.accessToken.next(tokens.access);
    this.refreshToken.next(tokens.refresh);
    this.isAuthenticated.next(true);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessToken.next(null);
    this.refreshToken.next(null);
    this.isAuthenticated.next(false);
  }

  getToken(): string | null {
    return this.accessToken.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.user_id?.toString() || null;
    } catch {
      return null;
    }
  }

  get isAuth$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
