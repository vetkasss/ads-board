import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { FilterService } from './filter.service';
import { CategoryService } from './category.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SearchService', () => {
  let service: SearchService;

  const mockFilterService = {
    filteredAds$: of([]),
    setAds: jasmine.createSpy('setAds'),
    updateFilters: jasmine.createSpy('updateFilters'),
    resetFilters: jasmine.createSpy('resetFilters')
  };

  const mockCategoryService = {
    categories$: of([]),
    loadCategories: jasmine.createSpy('loadCategories').and.returnValue(of([]))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        SearchService,
        { provide: FilterService, useValue: mockFilterService },
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});