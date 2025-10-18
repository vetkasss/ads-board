import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SidebarCategoriesComponent } from 'src/app/shared/components/sidebar-categories/sidebar-categories.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarCategoriesComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);
  private router = inject(Router);
  
  searchTerm: string = '';
  isSidebarOpen = false;
  
  private searchSubject = new Subject<string>();
  private debounceSubscription!: Subscription;

  ngOnInit(): void {
    this.debounceSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchService.setSearchValue(searchTerm);
      if (searchTerm.trim()) {
        this.searchService.search();
      } else {
        this.searchService.showRecommendationsMode();
      }
    });
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onCategorySelected(selection: { categoryName: string; categoryId: string; subcategoryName?: string; subcategoryId?: string }): void {
    const categoryName = selection.subcategoryName || selection.categoryName;
    
    // ПРОСТО УСТАНАВЛИВАЕМ КАТЕГОРИЮ И ФИЛЬТРУЕМ СУЩЕСТВУЮЩИЕ ОБЪЯВЛЕНИЯ
    this.searchService.setSelectedCategory(categoryName);
    this.searchService.search();
    
    this.closeSidebar();
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.searchService.setSearchValue(this.searchTerm);
      this.searchService.search();
    } else {
      this.searchService.showRecommendationsMode();
    }
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  ngOnDestroy(): void {
    if (this.debounceSubscription) {
      this.debounceSubscription.unsubscribe();
    }
  }
}