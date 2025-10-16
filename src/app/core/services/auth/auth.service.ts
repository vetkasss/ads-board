// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, of, map, tap, catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest, 
  ChangePasswordResponse, 
  UpdateProfileRequest,
  LoginResponse,
  AuthResponse
} from '../../models/auth.model';
import { StoreService } from '../store/store.service';
import { PasswordService } from './password.service';
import { UserStorageService } from './user-storage.service';
import { AuthErrorHandlerService } from './auth-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private store = inject(StoreService);
  private passwordService = inject(PasswordService);
  private userStorage = inject(UserStorageService);
  private errorHandler = inject(AuthErrorHandlerService);

  login(loginData: LoginRequest): Observable<LoginResponse> {
    this.store.setLoading(true);
    
    console.log('Attempting login for phone:', loginData.phone);
    
    return this.authenticateUser(loginData).pipe(
      tap(({ user, token }) => {
        this.handleSuccessfulAuth(user, token);
        console.log('Login successful:', { phone: user.phone, name: user.name });
      }),
      map(({ token }) => ({ token }) as LoginResponse),
      catchError(error => {
        console.log('Login failed for phone:', loginData.phone);
        return this.errorHandler.handleAuthError(error, 'login');
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    this.store.setLoading(true);

    // Валидация пароля
    const passwordValidation = this.passwordService.validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      this.store.setLoading(false);
      this.store.setError(passwordValidation.errors[0]);
      return throwError(() => new Error(passwordValidation.errors[0]));
    }

    return this.createUser(registerData).pipe(
      tap(({ user, token }) => {
        this.handleSuccessfulAuth(user, token);
        console.log('Registration successful:', { phone: user.phone, name: user.name });
      }),
      map(({ token }) => ({ token }) as LoginResponse),
      catchError(error => this.errorHandler.handleAuthError(error, 'register')),
      finalize(() => this.store.setLoading(false))
    );
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    this.store.setLoading(true);

    const currentUser = this.store.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('UNAUTHORIZED'));
    }

    return this.updateUserProfile(currentUser.id, profileData).pipe(
      tap(updatedUser => {
        this.store.updateUser(updatedUser);
        console.log('Profile updated successfully');
      }),
      map(user => user as User),
      catchError(error => this.errorHandler.handleAuthError(error, 'updateProfile')),
      finalize(() => this.store.setLoading(false))
    );
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    this.store.setLoading(true);

    const currentUser = this.store.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('UNAUTHORIZED'));
    }

    // Валидация нового пароля
    const passwordValidation = this.passwordService.validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      this.store.setLoading(false);
      this.store.setError(passwordValidation.errors[0]);
      return throwError(() => new Error(passwordValidation.errors[0]));
    }

    return this.updateUserPassword(currentUser.id, passwordData).pipe(
      tap(updatedUser => {
        this.store.updateUser(updatedUser);
        console.log('Password changed successfully for user:', updatedUser.phone);
      }),
      map(() => ({ message: 'Пароль успешно изменен', success: true }) as ChangePasswordResponse),
      catchError(error => this.errorHandler.handleAuthError(error, 'changePassword')),
      finalize(() => this.store.setLoading(false))
    );
  }

  // === Приватные методы для инкапсуляции логики ===

  private authenticateUser(loginData: LoginRequest): Observable<{ user: User; token: string }> {
    return new Observable(observer => {
      try {
        const user = this.userStorage.findUserByPhone(loginData.phone);
        
        if (!user) {
          observer.error(new Error('USER_NOT_FOUND'));
          return;
        }
        
        // Проверяем пароль через PasswordService
        // Учитываем что password опциональный в интерфейсе User
        if (!user.password || !this.passwordService.verifyPassword(loginData.password, user.password)) {
          observer.error(new Error('INVALID_PASSWORD'));
          return;
        }
        
        const token = this.generateToken();
        observer.next({ user, token });
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private createUser(registerData: RegisterRequest): Observable<{ user: User; token: string }> {
    return new Observable(observer => {
      try {
        // Проверяем существующего пользователя
        const existingUser = this.userStorage.findUserByPhone(registerData.phone);
        if (existingUser) {
          observer.error(new Error('USER_EXISTS'));
          return;
        }

        // Создаем нового пользователя с хэшированным паролем
        const hashedPassword = this.passwordService.hashPassword(registerData.password);
        
        const newUser: User = {
          id: Date.now(),
          name: registerData.name,
          phone: registerData.phone,
          password: hashedPassword, // Сохраняем хэш!
          address: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Сохраняем пользователя
        this.userStorage.addUser(newUser);
        const token = this.generateToken();
        
        observer.next({ user: newUser, token });
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private updateUserProfile(userId: number, profileData: UpdateProfileRequest): Observable<User> {
    return new Observable(observer => {
      try {
        const user = this.userStorage.findUserById(userId);
        if (!user) {
          observer.error(new Error('USER_NOT_FOUND'));
          return;
        }

        const updatedUser: User = {
          ...user,
          ...profileData,
          updatedAt: new Date()
        };

        this.userStorage.updateUser(updatedUser);
        observer.next(updatedUser);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private updateUserPassword(userId: number, passwordData: ChangePasswordRequest): Observable<User> {
    return new Observable(observer => {
      try {
        const user = this.userStorage.findUserById(userId);
        if (!user) {
          observer.error(new Error('USER_NOT_FOUND'));
          return;
        }

        // Проверяем текущий пароль (учитываем опциональность password)
        if (!user.password || !this.passwordService.verifyPassword(passwordData.currentPassword, user.password)) {
          observer.error(new Error('INVALID_PASSWORD'));
          return;
        }

        // Хэшируем новый пароль
        const newHashedPassword = this.passwordService.hashPassword(passwordData.newPassword);
        
        const updatedUser: User = {
          ...user,
          password: newHashedPassword,
          updatedAt: new Date()
        };

        this.userStorage.updateUser(updatedUser);
        observer.next(updatedUser);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private handleSuccessfulAuth(user: User, token: string): void {
    // Создаем AuthResponse для совместимости
    const authResponse: AuthResponse = {
      token,
      user,
      expiresIn: 3600, // 1 час
      refreshToken: `refresh_${token}`
    };
    
    this.store.setAuthData(authResponse);
    this.userStorage.saveAuthData(token, user);
    this.router.navigate(['/profile']);
  }

  // === Существующие публичные методы (не меняем интерфейс) ===

  fetchCurrentUser(): Observable<User> {
    const currentUser = this.store.currentUser;
    if (currentUser) {
      console.log('Current user from store:', currentUser);
      return of(currentUser);
    } else {
      console.log('No current user in store');
      return throwError(() => new Error('UNAUTHORIZED'));
    }
  }

  getCurrentUser(): Observable<User> {
    return this.fetchCurrentUser();
  }

  logout(): void {
    console.log('Logging out user - keeping ads');
    this.userStorage.clearAuthData();
    this.store.clearAuth();
    this.router.navigate(['/']);
  }

  private generateToken(): string {
    return 'local_token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
  }

  // === Геттеры (не меняем интерфейс) ===
  get isAuthenticated(): boolean {
    return this.store.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.store.currentUser;
  }

  get isAuthenticated$() {
    return this.store.authState$.pipe(map(state => state.isAuthenticated));
  }

  get currentUser$() {
    return this.store.currentUser$;
  }

  get isLoading$() {
    return this.store.isLoading$;
  }

  get error$() {
    return this.store.error$;
  }

  getToken(): string | null {
    return this.store.token;
  }
}