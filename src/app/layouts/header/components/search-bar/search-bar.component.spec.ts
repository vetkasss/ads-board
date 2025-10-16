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
  ]))
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
        { provide: CategoryService, useValue: mockCategoryService }, // Добавляем мок CategoryService
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
    component.searchTerm = 'test search';
    component.search();

    expect(mockSearchService.setSearchValue).toHaveBeenCalledWith('test search');
    expect(mockSearchService.search).toHaveBeenCalled();
  });
});