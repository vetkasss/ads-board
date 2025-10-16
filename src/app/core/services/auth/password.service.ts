import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  
  hashPassword(password: string): string {
    return btoa(password);
  }

  verifyPassword(plainPassword: string, hashedPassword: string): boolean {
    try {
      const inputHash = this.hashPassword(plainPassword);
      return inputHash === hashedPassword;
    } catch {
      return false;
    }
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Пароль должен содержать минимум 6 символов');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}