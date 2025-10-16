import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService {
  private store = inject(StoreService);

  handleAuthError(error: any, operation: string = 'operation'): Observable<never> {
    console.error(`Auth error in ${operation}:`, error);
    
    const userMessage = this.getUserFriendlyMessage(error);
    this.store.setError(userMessage);
    this.store.setLoading(false);
    
    return throwError(() => error);
  }

  private getUserFriendlyMessage(error: any): string {
    const message = error?.message || 'Произошла неизвестная ошибка';
    
    const messageMap: { [key: string]: string } = {
      'USER_NOT_FOUND': 'Пользователь с таким номером телефона не найден',
      'INVALID_PASSWORD': 'Неверный пароль',
      'USER_EXISTS': 'Пользователь с таким номером телефона уже существует',
      'UNAUTHORIZED': 'Пользователь не авторизован'
    };

    return messageMap[message] || message;
  }
}