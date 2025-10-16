import { Injectable } from '@angular/core';
import { Ad } from '../../models/ad.model';

@Injectable({
  providedIn: 'root'
})
export class AdStorageService {
  private readonly ADS_KEY = 'local_ads';

  getAds(): Ad[] {
    try {
      const saved = localStorage.getItem(this.ADS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveAd(ad: Ad): void {
    const ads = this.getAds();
    ads.push(ad);
    this.saveAllAds(ads);
  }

  updateAd(updatedAd: Ad): void {
    const ads = this.getAds();
    const index = ads.findIndex(ad => ad.id === updatedAd.id);
    
    if (index === -1) {
      throw new Error('Объявление не найдено');
    }
    
    ads[index] = updatedAd;
    this.saveAllAds(ads);
  }

  deleteAd(id: string): void {
    const ads = this.getAds().filter(ad => ad.id !== id);
    this.saveAllAds(ads);
  }

  getAdById(id: string): Ad | null {
    return this.getAds().find(ad => ad.id === id) || null;
  }

  getUserAds(userId: number): Ad[] {
    return this.getAds().filter(ad => ad.userId === userId);
  }

  private saveAllAds(ads: Ad[]): void {
    localStorage.setItem(this.ADS_KEY, JSON.stringify(ads));
  }
}