import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ad } from 'src/app/shared/ad.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchValue: string = '';
  private filteredValue: Ad[] = [];
  private searchResultsSubject = new BehaviorSubject<Ad[]>([]);
  private showRecommendations = new BehaviorSubject<boolean>(true);

  constructor() {}

  search(): void {
    if (!this.searchValue.trim()) {
      this.showRecommendations.next(true);
      this.searchResultsSubject.next([...this.filteredValue]);
      return;
    }
    
    this.showRecommendations.next(false);
    const results = this.filteredValue.filter(ad => 
      ad.title.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.searchResultsSubject.next(results);
  }

  showRecommendationsMode(): void {
    this.showRecommendations.next(true);
    this.searchResultsSubject.next([...this.filteredValue]);
  }

  setSearchValue(value: string): void {
    this.searchValue = value;
  }

  setFilteredValue(values: Ad[]): void {
    this.filteredValue = values;
  }

  getSearchResults() {
    return this.searchResultsSubject.asObservable();
  }

  getDisplayMode() {
    return this.showRecommendations.asObservable();
  }
}