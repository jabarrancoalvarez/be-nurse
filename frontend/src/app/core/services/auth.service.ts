import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiUrl;

  isLoggedIn = signal(this.hasToken());

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('nurse_token', res.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('nurse_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('nurse_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('nurse_token');
  }
}
