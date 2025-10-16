import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list';
import { AdService } from 'src/app/core/services/ads/ad.service';
import { SearchService } from 'src/app/core/services/search.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { FilterService } from 'src/app/core/services/filter.service';
import { of } from 'rxjs';

// Mock services
const mockAdService = {
  getAdvertisements: jasmine.createSpy('getAdvertisements').and.returnValue(of([]))
};

const mockSearchService = {
  setAllAds: jasmine.createSpy('setAllAds'),
  getFilteredResults: jasmine.createSpy('getFilteredResults').and.returnValue(of([])),
  getDisplayMode: jasmine.createSpy('getDisplayMode').and.returnValue(of(true)),
  getSearchValue: jasmine.createSpy('getSearchValue').and.returnValue(''),
  getSelectedCategory: jasmine.createSpy('getSelectedCategory').and.returnValue(''),
  updatePriceFilter: jasmine.createSpy('updatePriceFilter'),
  updateSortFilter: jasmine.createSpy('updateSortFilter'),
  resetSearch: jasmine.createSpy('resetSearch')
};

const mockStoreService = {
  getAllAds: jasmine.createSpy('getAllAds').and.returnValue([])
};

const mockFilterService = {}; 

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: AdService, useValue: mockAdService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: StoreService, useValue: mockStoreService },
        { provide: FilterService, useValue: mockFilterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});