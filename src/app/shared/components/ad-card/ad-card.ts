import { Component, input, output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateFormatPipe } from 'src/app/core/pipe/format-date.pipe';
import { Ad } from 'src/app/core/models/ad.model';

@Component({
  selector: 'app-ad-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DateFormatPipe],
  templateUrl: './ad-card.html',
  styleUrls: ['./ad-card.scss']
})
export class AdCardComponent implements OnInit, OnDestroy, OnChanges {
  ad = input.required<Ad>();
  adClick = output<Ad>();

  imageLoaded = false;
  imageError = false;
  private image?: HTMLImageElement;

  ngOnInit(): void {
    this.preloadImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad']) {
      this.preloadImage();
    }
  }

  ngOnDestroy(): void {
    this.cleanupImage();
  }

  private preloadImage(): void {
    this.cleanupImage();
    
    const imageUrl = this.ad().imageUrl?.trim();
    
    if (!imageUrl) {
      this.handleNoImage();
      return;
    }

    // Если это blob URL и он уже невалиден, ошибка
    if (imageUrl.startsWith('blob:') && !this.isValidBlobUrl(imageUrl)) {
      this.handleNoImage();
      return;
    }

    this.imageLoaded = false;
    this.imageError = false;

    this.image = new Image();
    
    this.image.onload = () => {
      this.imageLoaded = true;
      this.imageError = false;
    };
    
    this.image.onerror = () => {
      this.imageLoaded = true;
      this.imageError = true;
      this.cleanupImage();
    };
    
    this.image.src = imageUrl;

    // Проверка загружено ли изображение
    if (this.image.complete) {
      this.imageLoaded = true;
      this.imageError = !this.image.naturalHeight;
    }
  }

  private isValidBlobUrl(url: string): boolean {
    try {
      return url.startsWith('blob:') && url.length > 10;
    } catch {
      return false;
    }
  }

  private cleanupImage(): void {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
      this.image = undefined;
    }
  }

  private handleNoImage(): void {
    this.imageLoaded = true;
    this.imageError = true;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  }

  onClick(): void {
    this.adClick.emit(this.ad());
  }
}