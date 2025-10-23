import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Ad } from '../models/ad.model';

export interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'newest' | 'price_asc' | 'price_desc';
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterState = new BehaviorSubject<FilterState>({
    minPrice: null,
    maxPrice: null,
    sortBy: 'newest'
  });

  private adsSource = new BehaviorSubject<Ad[]>([]);

  filterState$ = this.filterState.asObservable();
  filteredAds$ = combineLatest([
    this.adsSource.pipe(distinctUntilChanged()),
    this.filterState$.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    )
  ]).pipe(
    map(([ads, filters]) => this.applyFilters(ads, filters))
  );

  setAds(ads: Ad[]): void {
    console.log('Setting ads:', ads.length);
    this.adsSource.next(ads);
  }

  updateFilters(filters: Partial<FilterState>): void {
    console.log('Updating filters:', filters);
    const current = this.filterState.value;
    this.filterState.next({ ...current, ...filters });
  }

  applyFilters(ads: Ad[], filters?: FilterState): Ad[] {
    const currentFilters = filters || this.filterState.value;
    console.log('Applying filters:', currentFilters, 'to', ads.length, 'ads');
    
    let filteredAds = [...ads];
    
    if (currentFilters.minPrice !== null) {
      filteredAds = filteredAds.filter(ad => ad.price >= currentFilters.minPrice!);
    }
    if (currentFilters.maxPrice !== null) {
      filteredAds = filteredAds.filter(ad => ad.price <= currentFilters.maxPrice!);
    }
    
    filteredAds = this.sortAds(filteredAds, currentFilters.sortBy);
    
    console.log('Filtered result:', filteredAds.length, 'ads');
    return filteredAds;
  }

  private sortAds(ads: Ad[], sortBy: string): Ad[] {
    const sortedAds = [...ads];
    
    switch (sortBy) {
      case 'price_asc': 
        return sortedAds.sort((a, b) => a.price - b.price);
      case 'price_desc': 
        return sortedAds.sort((a, b) => b.price - a.price);
      case 'newest': 
      default: 
        return sortedAds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  resetFilters(): void {
    console.log('Resetting all filters');
    this.filterState.next({
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest'
    });
  }

  getCurrentFilters(): FilterState {
    return this.filterState.value;
  }
}