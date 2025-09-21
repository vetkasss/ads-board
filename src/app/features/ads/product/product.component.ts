import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Ad } from '../../../shared/ad.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  ad: Ad | null = null;
  images: any[] = [];
  
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.loadAdvertisement();
  }

  private loadAdvertisement() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ad = this.mockDataService.getAdvertisementById(+id);
      if (this.ad) {
        this.prepareGalleryImages();
      }
    }
  }

  private prepareGalleryImages() {
    this.images = [];
    
    if (this.ad?.imageUrl) {
      this.images.push({
        itemImageSrc: this.ad.imageUrl,
        thumbnailImageSrc: this.ad.imageUrl,
        alt: this.ad?.title || 'Изображение'
      });
    }
    
    if (this.ad?.galleryImages && this.ad.galleryImages.length > 0) {
      this.ad.galleryImages.forEach(imageUrl => {
        this.images.push({
          itemImageSrc: imageUrl,
          thumbnailImageSrc: imageUrl,
          alt: this.ad?.title || 'Изображение галереи'
        });
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  get galleriaContainerStyle() {
    return {
      'max-width': '856px',
      'border': 'none',
      'box-shadow': 'none',
      'background': 'transparent',
      'padding': '0',
      'margin': '0'
    };
  }
}