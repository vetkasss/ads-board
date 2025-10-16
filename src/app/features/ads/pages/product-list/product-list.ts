import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdService } from 'src/app/core/services/ads/ad.service';
import { SearchService } from 'src/app/core/services/search.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { FilterService } from 'src/app/core/services/filter.service';
import { Ad } from 'src/app/core/models/ad.model';
import { AdCardComponent } from 'src/app/features/ads/ad-card/ad-card';
import { PositiveNumberDirective } from 'src/app/shared/directives/positive-number.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AdCardComponent,
    PositiveNumberDirective
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private adService = inject(AdService);
  private searchService = inject(SearchService);
  private storeService = inject(StoreService);
  private filterService = inject(FilterService);
  private router = inject(Router);

  displayedAds = signal<Ad[]>([]);
  allAds = signal<Ad[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  selectedSort = signal<'newest' | 'price_asc' | 'price_desc'>('newest');
  totalResults = signal(0);
  isShowingRecommendations = signal(true);

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadAllAds();
    this.setupSearchSubscriptions();
  }

  private loadAllAds(): void {
    this.isLoading.set(true);
    
    const allLocalAds = this.storeService.getAllAds();
    
    this.allAds.set(allLocalAds);
    this.displayedAds.set(allLocalAds);
    this.totalResults.set(allLocalAds.length);
    
    this.searchService.setAllAds(allLocalAds);
    
    this.loadServerAds();
  }

  private loadServerAds(): void {
    this.adService.getAdvertisements().subscribe({
      next: (serverAds) => {
        const currentLocalAds = this.storeService.getAllAds();
        const serverAdsWithoutDuplicates = serverAds.filter(serverAd => 
          !currentLocalAds.some(localAd => localAd.id === serverAd.id)
        );
        
        const mergedAds = [...currentLocalAds, ...serverAdsWithoutDuplicates];
        
        this.allAds.set(mergedAds);
        this.searchService.setAllAds(mergedAds);
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading server ads:', error);
        this.isLoading.set(false);
      }
    });
  }

  private setupSearchSubscriptions(): void {
    const filteredResultsSub = this.searchService.getFilteredResults().subscribe(ads => {
      this.displayedAds.set(ads);
      this.totalResults.set(ads.length);
    });

    const displayModeSub = this.searchService.getDisplayMode().subscribe(isRecommendations => {
      this.isShowingRecommendations.set(isRecommendations);
      
      if (isRecommendations) {
        this.searchQuery.set('');
        this.selectedCategory.set('');
      } else {
        this.searchQuery.set(this.searchService.getSearchValue());
        this.selectedCategory.set(this.searchService.getSelectedCategory());
      }
    });

    this.subscriptions.push(filteredResultsSub, displayModeSub);
  }

  onMinPriceChange(value: number | null): void {
    this.minPrice.set(value);
    this.searchService.updatePriceFilter(value, this.maxPrice());
  }

  onMaxPriceChange(value: number | null): void {
    this.maxPrice.set(value);
    this.searchService.updatePriceFilter(this.minPrice(), value);
  }

  onSortChange(sortValue: 'newest' | 'price_asc' | 'price_desc'): void {
    this.selectedSort.set(sortValue);
    this.searchService.updateSortFilter(sortValue);
  }

  resetFilters(): void {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.selectedSort.set('newest');
    this.searchService.resetSearch();
  }

  onAdvertisementClick(ad: Ad): void {
    this.router.navigate(['/ads', ad.id]);
  }

  refreshAds(): void {
    this.loadAllAds();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}