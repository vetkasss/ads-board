import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  private currentUser: User | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      this.authToken = token;
      this.currentUser = JSON.parse(userData);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', loginData).pipe(
      tap(response => {
        this.authToken = response.token;
        this.currentUser = response.user;
        this.isAuthenticatedSubject.next(true);
        
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.authToken = null;
    this.currentUser = null;
    this.isAuthenticatedSubject.next(false);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  getAuthData(): { token: string | null; user: User | null } {
    return {
      token: this.authToken,
      user: this.currentUser
    };
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.authToken;
  }
}