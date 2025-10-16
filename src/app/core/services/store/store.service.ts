import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, AuthState, AuthResponse } from '../../models/auth.model';
import { Ad } from '../../models/ad.model';
import { AuthStoreService} from './auth-store.service';
import { AdsStoreService, AdsState } from './ads-store.service';
import { UserStorageService } from './user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private authStore = inject(AuthStoreService);
  private adsStore = inject(AdsStoreService);
  private userStorage = inject(UserStorageService);

  // AuthStoreService
  get isAuthenticated(): boolean {
    return this.authStore.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.authStore.currentUser;
  }

  get token(): string | null {
    return this.authStore.token;
  }

  get isLoading$(): Observable<boolean> {
    return this.authStore.isLoading$;
  }

  get error$(): Observable<string | null> {
    return this.authStore.error$;
  }

  get currentUser$(): Observable<User | null> {
    return this.authStore.currentUser$;
  }

  get authState$(): Observable<AuthState> {
    return this.authStore.authState$;
  }

  setLoading(loading: boolean): void {
    this.authStore.setLoading(loading);
  }

  setError(error: string | null): void {
    this.authStore.setError(error);
  }

  setAuthData(authResponse: AuthResponse): void {
    this.authStore.setAuthData(authResponse);
  }

  setToken(token: string): void {
    this.authStore.setToken(token);
  }

  updateUser(user: User): void {
    this.authStore.updateUser(user);
    this.userStorage.updateUserInStorage(user);
  }

  clearAuth(): void {
    this.authStore.clearAuth();
  }


  //AdsStoreService


  get ads(): Ad[] {
    return this.adsStore.ads;
  }

  get adsState$(): Observable<AdsState> {
    return this.adsStore.adsState$;
  }

  addAd(ad: Ad): void {
    this.adsStore.addAd(ad);
  }

  getAllAds(): Ad[] {
    return this.adsStore.getAllAds();
  }

  getUserAds(userId: number): Ad[] {
    return this.adsStore.getUserAds(userId);
  }

  getOtherUsersAds(currentUserId: number): Ad[] {
    return this.adsStore.getOtherUsersAds(currentUserId);
  }

  getAdById(id: string): Ad | null {
    return this.adsStore.getAdById(id);
  }

  updateAd(updatedAd: Ad): void {
    this.adsStore.updateAd(updatedAd);
  }

  removeAd(id: string): void {
    this.adsStore.removeAd(id);
  }

 
  // UserStorageService

  getUsersFromLocalStorage(): User[] {
    return this.userStorage.getUsersFromLocalStorage();
  }

  findUserById(id: number): User | null {
    return this.userStorage.findUserById(id);
  }

  findUserByPhone(phone: string): User | null {
    return this.userStorage.findUserByPhone(phone);
  }

  addUserToStorage(user: User): void {
    this.userStorage.addUserToStorage(user);
  }


  //LocalStorage
 
  loadFromLocalStorage(): void {
    this.authStore.loadFromLocalStorage();
    this.adsStore.loadFromLocalStorage();
  }
}