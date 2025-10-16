import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiAd, ApiAdDetail } from '../../models/ad.model';


@Injectable({
  providedIn: 'root'
})
export class AdApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://dzitskiy.ru:5000/Advert';
  private imagesUrl = 'http://dzitskiy.ru:5000/Images';

  getAllAds(): Observable<ApiAd[]> {
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, {});
  }

  getAdById(id: string): Observable<ApiAdDetail> {
    return this.http.get<ApiAdDetail>(`${this.apiUrl}/${id}`);
  }

  searchAds(filters: any): Observable<ApiAd[]> {
    return this.http.post<ApiAd[]>(`${this.apiUrl}/search`, filters);
  }

  getImageById(id: string): Observable<Blob> {
    return this.http.get(`${this.imagesUrl}/${id}`, { responseType: 'blob' });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.imagesUrl}/${id}`);
  }
}