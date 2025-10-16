import { Injectable } from '@angular/core';
import { User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private readonly USERS_KEY = 'local_users';
  private readonly AUTH_KEY = 'auth_data';

  getUsers(): User[] {
    try {
      const saved = localStorage.getItem(this.USERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  }

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  findUserByPhone(phone: string): User | undefined {
    return this.getUsers().find(u => u.phone === phone);
  }

  findUserById(id: number): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  saveAuthData(token: string, user: User): void {
    const authData = { token, user };
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
  }

  getAuthData(): { token: string; user: User } | null {
    try {
      const saved = localStorage.getItem(this.AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  clearAuthData(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }
}