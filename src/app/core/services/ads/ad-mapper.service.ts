import { Injectable } from '@angular/core';
import { Ad, ApiAd, ApiAdDetail, CreateAdRequest } from '../../models/ad.model';


@Injectable({
  providedIn: 'root'
})
export class AdMapperService {
  private imagesUrl = 'http://dzitskiy.ru:5000/Images';

  mapApiAdToAd(apiAd: ApiAd): Ad {
    const firstImageId = apiAd.imagesIds?.[0];
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

  mapApiAdDetailToAd(apiAdDetail: ApiAdDetail): Ad {
    const firstImageId = apiAdDetail.imagesIds?.[0];
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

  createNewAd(adData: CreateAdRequest): Ad {
    return {
      id: this.generateId(),
      title: adData.title,
      description: adData.description,
      price: adData.price,
      location: adData.location,
      imageUrl: adData.imageUrl || '',
      galleryImages: adData.images || [],
      category: adData.category,
      subcategory: adData.subcategory || '',
      userId: adData.userId,
      date: new Date().toISOString(),
      views: 0,
      isFavorite: false,
    };
  }

  private generateId(): string {
    return 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}