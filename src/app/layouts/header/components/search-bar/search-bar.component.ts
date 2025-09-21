import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FormsModule } from '@angular/forms';
import { Ad } from 'src/app/shared/ad.model';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../../core/services/search.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private mockDataService = inject(MockDataService);
  private searchService = inject(SearchService);
  
  searchTerm: string = '';
  advertisements: Ad[] = [];
  filteredAds: Ad[] = [];
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private debounceSubscription!: Subscription;

  ngOnInit(): void {
    this.advertisements = this.mockDataService.getAdvertisements();
    this.filteredAds = [...this.advertisements];
    
    this.searchService.setFilteredValue(this.advertisements);
    this.searchService.showRecommendationsMode();
    
    this.searchSubscription = this.searchService.getSearchResults().subscribe({
      next: (results) => {
        this.filteredAds = results;
      }
    });
    
    this.debounceSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchService.setSearchValue(searchTerm);
      this.searchService.search();
    });
  }

  search(): void {
    this.searchService.setSearchValue(this.searchTerm);
    this.searchService.search();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.debounceSubscription) {
      this.debounceSubscription.unsubscribe();
    }
  }
}