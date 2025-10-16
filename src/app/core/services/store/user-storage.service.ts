import { Injectable } from '@angular/core';
import { User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  getUsersFromLocalStorage(): User[] {
    try {
      const saved = localStorage.getItem('local_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveUsersToLocalStorage(users: User[]): void {
    localStorage.setItem('local_users', JSON.stringify(users));
  }

  findUserById(id: number): User | null {
    const users = this.getUsersFromLocalStorage();
    return users.find(u => u.id === id) || null;
  }

  findUserByPhone(phone: string): User | null {
    const users = this.getUsersFromLocalStorage();
    return users.find(u => u.phone === phone) || null;
  }

  updateUserInStorage(updatedUser: User): void {
    const users = this.getUsersFromLocalStorage();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      this.saveUsersToLocalStorage(users);
    }
  }

  addUserToStorage(user: User): void {
    const users = this.getUsersFromLocalStorage();
    users.push(user);
    this.saveUsersToLocalStorage(users);
  }
}