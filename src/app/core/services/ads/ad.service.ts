import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Ad, ApiAd, ApiAdDetail, CreateAdRequest, ImageResponse } from '../../models/ad.model';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private http = inject(HttpClient);
  private apiUrl = 'http://dzitskiy.ru:5000/Advert';
  private imagesUrl = 'http://dzitskiy.ru:5000/Images';

  getAdvertisements(): Observable<Ad[]> {
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, {}).pipe(
      map(apiAds => apiAds.map(apiAd => this.mapApiAdToAd(apiAd))),
      catchError(error => {
        console.error('Error loading ads from server:', error);
        return of([]);
      })
    );
  }

  getAdvertisementById(id: string): Observable<Ad> {
    return this.http.get<ApiAdDetail>(`${this.apiUrl}/${id}`).pipe(
      map(apiAdDetail => this.mapApiAdDetailToAd(apiAdDetail)),
      catchError(error => {
        console.error(`Error loading ad ${id} from server:`, error);
        throw error;
      })
    );
  }

  getAdvertisementsByCategory(categoryId: string, subcategoryId?: string): Observable<Ad[]> {
    const filters: any = { categoryId };
    if (subcategoryId) filters.subcategoryId = subcategoryId;
    
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, filters).pipe(
      map(apiAds => apiAds.map(apiAd => this.mapApiAdToAd(apiAd))),
      catchError(error => {
        console.error('Error loading ads by category from server:', error);
        return of([]);
      })
    );
  }

  getUserAdvertisements(userId: number): Observable<Ad[]> {
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, { userId }).pipe(
      map(apiAds => apiAds.map(apiAd => this.mapApiAdToAd(apiAd))),
      catchError(error => {
        console.error('Error loading user ads from server:', error);
        return of([]);
      })
    );
  }

  searchAdvertisements(query: string): Observable<Ad[]> {
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, { search: query }).pipe(
      map(apiAds => apiAds.map(apiAd => this.mapApiAdToAd(apiAd))),
      catchError(error => {
        console.error('Error searching ads from server:', error);
        return of([]);
      })
    );
  }

  addAdvertisement(adData: CreateAdRequest): Observable<Ad> {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const newAd: Ad = {
      id,
      title: adData.title,
      description: adData.description,
      price: adData.price,
      location: adData.location,
      imageUrl: adData.imageUrl || '',
      galleryImages: adData.images || [],
      category: adData.category,
      subcategory: adData.subcategory,
      userId: adData.userId,
      date: new Date().toISOString(),
      views: 0,
      isFavorite: false
    };

    this.saveAdToLocalStorage(newAd);
    return of(newAd);
  }

  updateAdvertisement(id: string, adData: Partial<Ad>): Observable<Ad> {
    const ads = this.getAdsFromLocalStorage();
    const adIndex = ads.findIndex(ad => ad.id === id);
    
    if (adIndex === -1) {
      throw new Error('Объявление не найдено');
    }
    
    const updatedAd: Ad = {
      ...ads[adIndex],
      ...adData
    };
    
    ads[adIndex] = updatedAd;
    localStorage.setItem('local_ads', JSON.stringify(ads));
    
    return of(updatedAd);
  }

  deleteAdvertisement(id: string): Observable<void> {
    const ads = this.getAdsFromLocalStorage();
    const filteredAds = ads.filter(ad => ad.id !== id);
    localStorage.setItem('local_ads', JSON.stringify(filteredAds));
    return of(void 0);
  }

  uploadImage(imageFile: File): Observable<ImageResponse> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        
        const response: ImageResponse = {
          id: Date.now().toString(),
          url: base64Image,
          fileName: imageFile.name
        };
        
        observer.next(response);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(imageFile);
    });
  }

  getImageById(id: string): Observable<Blob> {
    return this.http.get(`${this.imagesUrl}/${id}`, { responseType: 'blob' });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.imagesUrl}/${id}`);
  }

  private saveAdToLocalStorage(ad: Ad): void {
    const ads = this.getAdsFromLocalStorage();
    ads.push(ad);
    localStorage.setItem('local_ads', JSON.stringify(ads));
  }

  private getAdsFromLocalStorage(): Ad[] {
    try {
      const saved = localStorage.getItem('local_ads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private mapApiAdToAd(apiAd: ApiAd): Ad {
    const firstImageId = apiAd.imagesIds && apiAd.imagesIds.length > 0 ? apiAd.imagesIds[0] : null;
    const imageUrl = firstImageId ? `${this.imagesUrl}/${firstImageId}` : '';

    return {
      id: apiAd.id,
      title: apiAd.name || 'Без названия',
      description: '',
      price: apiAd.cost || 0,
      location: apiAd.location || 'Адрес не указан',
      imageUrl: imageUrl,
      galleryImages: apiAd.imagesIds?.map(id => `${this.imagesUrl}/${id}`) || [],
      category: '', 
      subcategory: '',
      userId: apiAd.userId || 0,
      date: apiAd.createdAt,
      views: 0,
      isFavorite: false
    };
  }

  private mapApiAdDetailToAd(apiAdDetail: ApiAdDetail): Ad {
    const firstImageId = apiAdDetail.imagesIds && apiAdDetail.imagesIds.length > 0 ? apiAdDetail.imagesIds[0] : null;
    const imageUrl = firstImageId ? `${this.imagesUrl}/${firstImageId}` : '';

    return {
      id: apiAdDetail.id,
      title: apiAdDetail.name || 'Без названия',
      description: apiAdDetail.description || '',
      price: apiAdDetail.cost || 0,
      location: apiAdDetail.location || 'Адрес не указан',
      imageUrl: imageUrl,
      galleryImages: apiAdDetail.imagesIds?.map(id => `${this.imagesUrl}/${id}`) || [],
      category: apiAdDetail.category?.name || '',
      subcategory: '',
      categoryId: apiAdDetail.category?.id || '',
      userId: apiAdDetail.userId || 0,
      date: apiAdDetail.created,
      views: 0,
      isFavorite: false
    };
  }
}