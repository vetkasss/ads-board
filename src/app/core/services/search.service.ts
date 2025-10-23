import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs';
import { Ad } from 'src/app/core/models/ad.model';
import { FilterService } from './filter.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private filterService = inject(FilterService);
  private categoryService = inject(CategoryService);

  private searchValue = new BehaviorSubject<string>('');
  private allAds = new BehaviorSubject<Ad[]>([]);
  private searchResults = new BehaviorSubject<Ad[]>([]);
  private displayMode = new BehaviorSubject<boolean>(true);
  private selectedCategory = new BehaviorSubject<string>('');

  filteredResults$ = combineLatest([
    this.searchResults,
    this.filterService.filteredAds$
  ]).pipe(
    map(([searchResults, filteredAds]) => {
      const searchResultIds = new Set(searchResults.map(ad => ad.id));
      return filteredAds.filter(ad => searchResultIds.has(ad.id));
    })
  );

  setSearchValue(value: string): void {
    this.searchValue.next(value);
  }

  getSearchValue(): string {
    return this.searchValue.value;
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.next(category);
  }

  getSelectedCategory(): string {
    return this.selectedCategory.value;
  }

  setAllAds(ads: Ad[]): void {
    console.log('Setting all ads:', ads.length);
    
    this.categoryService.categories$.subscribe(categories => {
      const normalizedAds = ads.map(ad => this.normalizeAdCategories(ad, categories));
      this.allAds.next(normalizedAds);
      this.filterService.setAds(normalizedAds); 
      this.performSearch();
    });
  }

  addAds(newAds: Ad[]): void {
    const currentAds = this.allAds.value;
    const existingIds = new Set(currentAds.map(ad => ad.id));
    
    this.categoryService.categories$.subscribe(categories => {
      const normalizedNewAds = newAds.map(ad => this.normalizeAdCategories(ad, categories));
      const uniqueNewAds = normalizedNewAds.filter(ad => !existingIds.has(ad.id));
      const mergedAds = [...currentAds, ...uniqueNewAds];
      
      this.allAds.next(mergedAds);
      this.filterService.setAds(mergedAds); 
      this.performSearch();
    });
  }

  private normalizeAdCategories(ad: Ad, categories: any[]): Ad {
    if (ad.category && ad.category !== '') {
      return ad;
    }
    const detectedCategory = this.detectCategoryFromContent(ad, categories);
    
    return {
      ...ad,
      category: detectedCategory.category,
      subcategory: detectedCategory.subcategory,
      categoryId: detectedCategory.categoryId,
      subcategoryId: detectedCategory.subcategoryId
    };
  }

  private detectCategoryFromContent(ad: Ad, categories: any[]): { 
    category: string; 
    subcategory: string; 
    categoryId: string; 
    subcategoryId: string; 
  } {
    const title = ad.title.toLowerCase();
    const description = (ad.description || '').toLowerCase();

    const categoryKeywords = {
      'Транспорт': ['машина', 'авто', 'мерседес', 'bmw', 'ваз', 'мотоцикл', 'автомобиль', 'транспорт', 'шины', 'диски'],
      'Недвижимость': ['дом', 'коттедж', 'квартира', 'недвижимость', 'участок', 'этаж', 'сот', 'м²'],
      'Электроника': ['телефон', 'iphone', 'ноутбук', 'принтер', 'rtx', 'geforce', 'камера', 'электроника'],
      'Работа': ['работа', 'вакансия', 'уборщица', 'сварщик', 'рабочий'],
      'Животные': ['котенок', 'акула', 'животные', 'питомец', 'чижик'],
      'Услуги': ['услуги', 'работы', 'выполняю', 'сварочные']
    };

    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (title.includes(keyword) || description.includes(keyword)) {
          
          const foundCategory = this.findCategoryByName(categories, categoryName);
          if (foundCategory) {
            return {
              category: foundCategory.name,
              subcategory: foundCategory.children?.[0]?.name || 'Общее',
              categoryId: foundCategory.id,
              subcategoryId: foundCategory.children?.[0]?.id || ''
            };
          }
        }
      }
    }
    const otherCategory = this.findCategoryByName(categories, 'Другое') || 
                         this.findCategoryByName(categories, 'Разное');
    
    return {
      category: otherCategory?.name || 'Другое',
      subcategory: 'Общее',
      categoryId: otherCategory?.id || '',
      subcategoryId: ''
    };
  }

  private findCategoryByName(categories: any[], name: string): any {
    for (const category of categories) {
      if (category.name === name) {
        return category;
      }
      if (category.children) {
        const found = this.findCategoryByName(category.children, name);
        if (found) return found;
      }
    }
    return null;
  }

  showRecommendationsMode(): void {
    this.displayMode.next(true);
    this.searchResults.next(this.allAds.value);
    this.selectedCategory.next('');
    this.searchValue.next('');
  }

  showSearchMode(): void {
    this.displayMode.next(false);
  }

  getDisplayMode() {
    return this.displayMode.asObservable();
  }

  search(): void {
    this.showSearchMode();
    this.performSearch();
  }

  private performSearch(): void {
    const searchTerm = this.searchValue.value.toLowerCase();
    const selectedCategory = this.selectedCategory.value;
    const allAds = this.allAds.value;

    console.log('Performing search:', {
      totalAds: allAds.length,
      searchTerm,
      selectedCategory
    });

    let filtered = allAds;

    if (selectedCategory) {
      filtered = filtered.filter(ad => {
        const categoryMatch = ad.category?.toLowerCase().includes(selectedCategory.toLowerCase());
        const subcategoryMatch = ad.subcategory?.toLowerCase().includes(selectedCategory.toLowerCase());
        
        const matches = categoryMatch || subcategoryMatch;
        
        console.log(`Checking ad "${ad.title}": category="${ad.category}", subcategory="${ad.subcategory}", matches=${matches}`);
        return matches;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(ad => {
        const categoryName = ad.category || '';
        const subcategoryName = ad.subcategory || '';
        
        return ad.title.toLowerCase().includes(searchTerm) ||
               ad.description?.toLowerCase().includes(searchTerm) ||
               ad.location.toLowerCase().includes(searchTerm) ||
               categoryName.toLowerCase().includes(searchTerm) ||
               subcategoryName.toLowerCase().includes(searchTerm);
      });
    }

    console.log('Search results after filters:', filtered.length);
    this.searchResults.next(filtered);
  }

  getSearchResults() {
    return this.searchResults.asObservable();
  }

  getFilteredResults() {
    return this.filteredResults$;
  }

  resetSearch(): void {
    this.searchValue.next('');
    this.selectedCategory.next('');
    this.showRecommendationsMode();
    this.filterService.resetFilters(); 
  }

  getAllAds(): Ad[] {
    return this.allAds.value;
  }

  updatePriceFilter(minPrice: number | null, maxPrice: number | null): void {
    this.filterService.updateFilters({ minPrice, maxPrice });
  }

  updateSortFilter(sortBy: 'newest' | 'price_asc' | 'price_desc'): void {
    this.filterService.updateFilters({ sortBy });
  }
}