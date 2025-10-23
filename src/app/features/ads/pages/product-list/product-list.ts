import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdService } from 'src/app/core/services/ads/ad.service';
import { SearchService } from 'src/app/core/services/search.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Ad } from 'src/app/core/models/ad.model';
import { AdCardComponent } from 'src/app/shared/components/ad-card/ad-card';
import { PositiveNumberDirective } from 'src/app/shared/directives/positive-number.directive';
import { Observable, map, tap, catchError, of } from 'rxjs';

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
export class ProductListComponent implements OnInit {
  private adService = inject(AdService);
  private searchService = inject(SearchService);
  private storeService = inject(StoreService);
  private router = inject(Router);

  filteredAds$: Observable<Ad[]> = this.searchService.getFilteredResults();
  displayMode$: Observable<boolean> = this.searchService.getDisplayMode();
  
  totalResults$ = this.filteredAds$.pipe(map(ads => ads.length));
  
  isLoading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  selectedSort = signal<'newest' | 'price_asc' | 'price_desc'>('newest');

  pageTitle = computed(() => {
    if (this.isShowingRecommendations()) return 'Рекомендации для вас';
    if (this.selectedCategory()) return `Результаты по категории "${this.selectedCategory()}"`;
    if (this.searchQuery()) return `Результаты по поиску "${this.searchQuery()}"`;
    return 'Все объявления';
  });

  isEmptyResults$ = this.filteredAds$.pipe(
    map(ads => ads.length === 0 && !this.isLoading())
  );


  isShowingRecommendations = signal(true);

  ngOnInit(): void {
    this.loadAllAds();
    this.setupDisplayMode();
  }

  private loadAllAds(): void {
    this.isLoading.set(true);
    
    const allLocalAds = this.storeService.getAllAds();
    this.searchService.setAllAds(allLocalAds);
    
    this.adService.getAdvertisements().pipe(
      tap(serverAds => {
        const currentLocalAds = this.storeService.getAllAds();
        const serverAdsWithoutDuplicates = serverAds.filter(serverAd => 
          !currentLocalAds.some(localAd => localAd.id === serverAd.id)
        );
        
        const mergedAds = [...currentLocalAds, ...serverAdsWithoutDuplicates];
        this.searchService.setAllAds(mergedAds);
      }),
      catchError(error => {
        console.error('Error loading server ads:', error);
        return of([]);
      })
    ).subscribe({
      complete: () => this.isLoading.set(false)
    });
  }

  private setupDisplayMode(): void {
    this.displayMode$.subscribe(isRecommendations => {
      this.isShowingRecommendations.set(isRecommendations);
      
      if (isRecommendations) {
        this.searchQuery.set('');
        this.selectedCategory.set('');
      } else {
        this.searchQuery.set(this.searchService.getSearchValue());
        this.selectedCategory.set(this.searchService.getSelectedCategory());
      }
    });
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

}