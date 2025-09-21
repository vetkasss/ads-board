import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Ad } from '../../../shared/ad.model';
import { ProductCardComponent } from '../product-card/product-card';
import { SearchService } from '../../../core/services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private mockDataService = inject(MockDataService);
  private router = inject(Router);
  private searchService = inject(SearchService);
  
  advertisements: Ad[] = [];
  displayedAds: Ad[] = [];
  isShowingRecommendations: boolean = true;
  
  private searchSubscription!: Subscription;
  private modeSubscription!: Subscription;

  ngOnInit(): void {
    this.advertisements = this.mockDataService.getAdvertisements();
    this.displayedAds = [...this.advertisements];
    
    this.searchSubscription = this.searchService.getSearchResults().subscribe({
      next: (results: Ad[]) => {
        this.displayedAds = results;
      }
    });
    
    this.modeSubscription = this.searchService.getDisplayMode().subscribe({
      next: (isRecommendations) => {
        this.isShowingRecommendations = isRecommendations;
        if (isRecommendations) {
          this.displayedAds = [...this.advertisements];
        }
      }
    });
  }

  onAdvertisementClick(ad: Ad): void {
    this.router.navigate(['/ad', ad.id]);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }
}