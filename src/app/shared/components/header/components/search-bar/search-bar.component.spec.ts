import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';
import { SearchService } from 'src/app/core/services/search.service';
import { CategoryService } from 'src/app/core/services/category.service';

// Mock services
const mockSearchService = {
  setSearchValue: jasmine.createSpy('setSearchValue'),
  search: jasmine.createSpy('search'),
  showRecommendationsMode: jasmine.createSpy('showRecommendationsMode'),
  setSelectedCategory: jasmine.createSpy('setSelectedCategory')
};

const mockCategoryService = {
  loadCategories: jasmine.createSpy('loadCategories').and.returnValue(of([
    { id: '1', name: 'Electronics', children: [] },
    { id: '2', name: 'Cars', children: [] }
  ])),
  categories$: of([
    { id: '1', name: 'Electronics', children: [] },
    { id: '2', name: 'Cars', children: [] }
  ])
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search service when searching', () => {
    // Используем set() для установки значения в Signal
    component.searchTerm.set('test search');
    component.search();

    expect(mockSearchService.setSearchValue).toHaveBeenCalledWith('test search');
    expect(mockSearchService.search).toHaveBeenCalled();
  });

  it('should initialize with empty search term', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('should open and close sidebar', () => {
    component.openSidebar();
    expect(component.isSidebarOpen()).toBeTrue();

    component.closeSidebar();
    expect(component.isSidebarOpen()).toBeFalse();
  });

  it('should handle category selection', () => {
    const selection = {
      categoryName: 'Electronics',
      categoryId: '1',
      subcategoryName: 'Phones',
      subcategoryId: '2'
    };

    component.onCategorySelected(selection);

    expect(mockSearchService.setSelectedCategory).toHaveBeenCalledWith('Phones');
    expect(mockSearchService.search).toHaveBeenCalled();
    expect(component.isSidebarOpen()).toBeFalse();
  });

  it('should clear search', () => {
    component.searchTerm.set('test');
    component.clearSearch();

    expect(component.searchTerm()).toBe('');
    expect(mockSearchService.showRecommendationsMode).toHaveBeenCalled();
  });

  it('should compute hasSearchTerm correctly', () => {
    expect(component.hasSearchTerm()).toBeFalse();

    component.searchTerm.set('test');
    expect(component.hasSearchTerm()).toBeTrue();

    component.searchTerm.set('   ');
    expect(component.hasSearchTerm()).toBeFalse();
  });

  it('should compute searchButtonText correctly', () => {
    expect(component.searchButtonText()).toBe('Сбросить');

    component.searchTerm.set('test');
    expect(component.searchButtonText()).toBe('Найти');
  });

  it('should call onSearchInputChange', () => {
    const nextSpy = spyOn(component['searchSubject'], 'next');

    component.searchTerm.set('new value');
    component.onSearchInputChange();

    expect(nextSpy).toHaveBeenCalledWith('new value');
  });
});