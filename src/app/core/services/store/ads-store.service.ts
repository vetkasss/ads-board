import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ad } from '../../models/ad.model';

export interface AdsState {
  ads: Ad[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdsStoreService {
  private adsInitialState: AdsState = {
    ads: [],
    isLoading: false,
    error: null
  };

  private adsStateSubject = new BehaviorSubject<AdsState>(this.adsInitialState);
  public readonly adsState$ = this.adsStateSubject.asObservable();

  get ads(): Ad[] {
    return this.adsStateSubject.value.ads;
  }

  addAd(ad: Ad): void {
    const allAds = this.getAllAdsFromStorage();
    const newAds = [ad, ...allAds];
    
    this.saveAllAdsToStorage(newAds);
    
    this.adsStateSubject.next({
      ...this.adsStateSubject.value,
      ads: newAds
    });
  }

  getAllAds(): Ad[] {
    return this.getAllAdsFromStorage();
  }

  getUserAds(userId: number): Ad[] {
    const allAds = this.getAllAdsFromStorage();
    return allAds.filter(ad => ad.userId === userId);
  }

  getOtherUsersAds(currentUserId: number): Ad[] {
    const allAds = this.getAllAdsFromStorage();
    return allAds.filter(ad => ad.userId !== currentUserId);
  }

  getAdById(id: string): Ad | null {
    const allAds = this.getAllAdsFromStorage();
    return allAds.find(ad => ad.id === id) || null;
  }

  updateAd(updatedAd: Ad): void {
    const allAds = this.getAllAdsFromStorage();
    const index = allAds.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) {
      allAds[index] = updatedAd;
      this.saveAllAdsToStorage(allAds);
      
      this.adsStateSubject.next({
        ...this.adsStateSubject.value,
        ads: allAds
      });
    }
  }

  removeAd(id: string): void {
    const allAds = this.getAllAdsFromStorage();
    const filteredAds = allAds.filter(ad => ad.id !== id);
    this.saveAllAdsToStorage(filteredAds);
    
    this.adsStateSubject.next({
      ...this.adsStateSubject.value,
      ads: filteredAds
    });
  }

  loadFromLocalStorage(): void {
    try {
      const allAds = this.getAllAdsFromStorage();
      this.adsStateSubject.next({
        ...this.adsInitialState,
        ads: allAds
      });
    } catch (e) {
    }
  }

  private saveAllAdsToStorage(ads: Ad[]): void {
    localStorage.setItem('all_ads', JSON.stringify(ads));
  }

  private getAllAdsFromStorage(): Ad[] {
    try {
      const saved = localStorage.getItem('all_ads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
}