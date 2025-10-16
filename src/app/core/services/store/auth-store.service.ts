import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, AuthResponse, AuthState} from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private authInitialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null
  };

  private authStateSubject = new BehaviorSubject<AuthState>(this.authInitialState);
  public readonly authState$ = this.authStateSubject.asObservable();

  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get token(): string | null {
    return this.authStateSubject.value.token;
  }

  get isLoading$(): Observable<boolean> {
    return this.authState$.pipe(map(state => state.isLoading));
  }

  get error$(): Observable<string | null> {
    return this.authState$.pipe(map(state => state.error));
  }

  get currentUser$(): Observable<User | null> {
    return this.authState$.pipe(map(state => state.user));
  }

  setLoading(loading: boolean): void {
    this.updateAuthState({ 
      isLoading: loading,
      error: loading ? null : this.authStateSubject.value.error
    });
  }

  setError(error: string | null): void {
    this.updateAuthState({ error });
  }

  setAuthData(authResponse: AuthResponse): void {
    this.updateAuthState({
      user: authResponse.user,
      token: authResponse.token,
      isAuthenticated: true,
      error: null,
      isLoading: false
    });
    this.saveAuthToLocalStorage(authResponse);
  }

  setToken(token: string): void {
    this.updateAuthState({
      token,
      isAuthenticated: true,
      error: null,
      isLoading: false
    });
    localStorage.setItem('auth_token', token);
  }

  updateUser(user: User): void {
    this.updateAuthState({ 
      user: user
    });
    this.saveUserToLocalStorage(user);
  }

  clearAuth(): void {
    this.updateAuthState(this.authInitialState);
    this.clearAuthStorage();
  }

  loadFromLocalStorage(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user_data');
      if (token && userStr) {
        const user: User = JSON.parse(userStr);
        this.updateAuthState({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }
    } catch (e) {
      this.clearAuthStorage();
    }
  }

  private updateAuthState(partial: Partial<AuthState>): void {
    const current = this.authStateSubject.value;
    const newState = { ...current, ...partial };
    this.authStateSubject.next(newState);
  }

  private saveAuthToLocalStorage(auth: AuthResponse): void {
    localStorage.setItem('auth_token', auth.token);
    localStorage.setItem('user_data', JSON.stringify(auth.user));
    if (auth.refreshToken) {
      localStorage.setItem('refresh_token', auth.refreshToken);
    }
  }

  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private clearAuthStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('refresh_token');
  }
}