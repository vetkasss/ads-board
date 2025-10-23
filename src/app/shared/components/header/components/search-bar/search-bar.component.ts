import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';
import { SidebarCategoriesComponent } from 'src/app/shared/components/sidebar-categories/sidebar-categories.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarCategoriesComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  private searchService = inject(SearchService);

  searchTerm = signal('');
  isSidebarOpen = signal(false);
  
  hasSearchTerm = computed(() => this.searchTerm().trim().length > 0);
  searchButtonText = computed(() => this.hasSearchTerm() ? 'Найти' : 'Сбросить');
  
  private searchSubject = new Subject<string>();

  constructor() {
    effect(() => {
      const searchTerm = this.searchTerm();
      
      if (searchTerm.trim()) {
        this.searchService.setSearchValue(searchTerm);
        this.searchService.search();
      }
    });

    const subscription = this.searchSubject.pipe(
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

    effect((onCleanup) => {
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  onCategorySelected(selection: { categoryName: string; categoryId: string; subcategoryName?: string; subcategoryId?: string }): void {
    const categoryName = selection.subcategoryName || selection.categoryName;
    
    this.searchService.setSelectedCategory(categoryName);
    this.searchService.search();
    
    this.closeSidebar();
  }

  search(): void {
    if (this.hasSearchTerm()) {
      this.searchService.setSearchValue(this.searchTerm());
      this.searchService.search();
    } else {
      this.searchService.showRecommendationsMode();
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchService.showRecommendationsMode();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchTerm());
  }
}