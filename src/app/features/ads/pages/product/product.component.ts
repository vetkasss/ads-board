// src/app/features/ads/product/product.component.ts
import { Component, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AdService } from '../../../../core/services/ads/ad.service';
import { StoreService } from '../../../../core/services/store/store.service';
import { Ad,  GalleryImage } from '../../../../core/models/ad.model';
import { PhoneDialogComponent } from 'src/app/shared/components/dialogs/auth-dialog/phone-dialog/phone-dialog.component';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ButtonModule, PhoneDialogComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild(PhoneDialogComponent) phoneDialog!: PhoneDialogComponent;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adService = inject(AdService);
  private storeService = inject(StoreService);

  ad = signal<Ad | null>(null);
  currentImageIndex = signal(0);
  breadcrumbs = signal<string[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  images = computed(() => {
    const currentAd = this.ad();
    if (!currentAd) return [];
    
    const images: GalleryImage[] = [];
    const altText = currentAd.title || 'Изображение';

    if (currentAd.imageUrl && currentAd.imageUrl.trim() !== '') {
      images.push({
        itemImageSrc: currentAd.imageUrl,
        thumbnailImageSrc: currentAd.imageUrl,
        alt: altText
      });
    }

    if (currentAd.galleryImages) {
      currentAd.galleryImages.filter(img => img && img.trim() !== '').forEach(imageUrl => {
        images.push({
          itemImageSrc: imageUrl,
          thumbnailImageSrc: imageUrl,
          alt: `${altText} галереи`
        });
      });
    }
    
    return images;
  });

  private readonly brands = [
    'Apple', 'Samsung', 'Sony', 'Ford', 'Fender', 'Kawasaki', 
    'DeLonghi', 'Rolex', 'Microsoft', 'Lenovo', 'HP', 'Dell',
    'Asus', 'Acer', 'Xiaomi', 'Huawei', 'Nokia', 'LG', 'Canon',
    'Nikon', 'PlayStation', 'Xbox', 'Nintendo'
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAdvertisement(id);
    } else {
      this.error.set('ID объявления не указан');
      this.isLoading.set(false);
    }
  }

  private loadAdvertisement(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Поиск локально
    const localAd = this.storeService.getAdById(id);
    if (localAd) {
      this.ad.set(localAd);
      this.generateBreadcrumbs(localAd);
      this.isLoading.set(false);
      return;
    }

    // Если локально не нашли, звгружаем с сервера
    this.adService.getAdvertisementById(id).subscribe({
      next: (serverAd) => {
        this.ad.set(serverAd);
        this.generateBreadcrumbs(serverAd);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки объявления:', error);
        this.error.set('Объявление не найдено или было удалено');
        this.isLoading.set(false);
      }
    });
  }

  private generateBreadcrumbs(ad: Ad): void {
    const breadcrumbs = [
      ad.location,
      ad.category,
      ad.subcategory,
      this.extractBrandFromTitle(ad.title)
    ].filter(Boolean) as string[];
    
    this.breadcrumbs.set(breadcrumbs);
  }

  private extractBrandFromTitle(title: string): string | null {
    if (!title) return null;

    const lowerTitle = title.toLowerCase();
    return this.brands.find(brand => 
      lowerTitle.includes(brand.toLowerCase())
    ) || null;
  }

  showPhoneNumber(): void {
    const adData = this.ad();
    if (!adData) return;

    // Получаем всех пользователей из localStorage 
    const users = this.storeService.getUsersFromLocalStorage();
    
    const owner = users.find(user => user.id === adData.userId);

    if (owner?.phone) {
      this.phoneDialog.show(owner.phone);
    } else {
      console.warn('Номер телефона владельца объявления не найден');
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  goBack(): void {
    this.router.navigate(['/ads']);
  }
}