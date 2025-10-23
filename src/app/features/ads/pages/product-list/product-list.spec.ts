import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list';
import { AdService } from 'src/app/core/services/ads/ad.service';
import { SearchService } from 'src/app/core/services/search.service';
import { StoreService } from 'src/app/core/services/store/store.service';
import { FilterService } from 'src/app/core/services/filter.service';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let searchService: jasmine.SpyObj<SearchService>;
  let adService: jasmine.SpyObj<AdService>;
  let storeService: jasmine.SpyObj<StoreService>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', [
      'getFilteredResults', 'getDisplayMode', 'setAllAds', 'setSearchValue',
      'setSelectedCategory', 'updatePriceFilter', 'updateSortFilter', 'resetSearch',
      'getSearchValue', 'getSelectedCategory', 'search', 'showRecommendationsMode',
      'getSearchResults', 'getAllAds', 'addAds'
    ]);

    const adServiceSpy = jasmine.createSpyObj('AdService', [
      'getAdvertisements', 'getAdvertisementById', 'searchAdvertisements',
      'addAdvertisement', 'updateAdvertisement', 'deleteAdvertisement',
      'uploadImage', 'getImageById', 'deleteImage'
    ]);

    const storeServiceSpy = jasmine.createSpyObj('StoreService', [
      'getAllAds', 'getUserAds', 'getOtherUsersAds', 'getAdById',
      'addAd', 'updateAd', 'removeAd', 'getUsersFromLocalStorage'
    ]);

    const filterServiceSpy = jasmine.createSpyObj('FilterService', [
      'setAds', 'updateFilters', 'resetFilters', 'applyFilters', 'getCurrentFilters'
    ]);

    // Настраиваем возвращаемые значения
    searchServiceSpy.getFilteredResults.and.returnValue(of([]));
    searchServiceSpy.getDisplayMode.and.returnValue(of(true));
    searchServiceSpy.getSearchResults.and.returnValue(of([]));
    searchServiceSpy.getSearchValue.and.returnValue('');
    searchServiceSpy.getSelectedCategory.and.returnValue('');
    searchServiceSpy.getAllAds.and.returnValue([]);

    adServiceSpy.getAdvertisements.and.returnValue(of([]));
    storeServiceSpy.getAllAds.and.returnValue([]);

    filterServiceSpy.filteredAds$ = of([]);
    filterServiceSpy.filterState$ = of({});

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: AdService, useValue: adServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: StoreService, useValue: storeServiceSpy },
        { provide: FilterService, useValue: filterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    adService = TestBed.inject(AdService) as jasmine.SpyObj<AdService>;
    storeService = TestBed.inject(StoreService) as jasmine.SpyObj<StoreService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have getFilteredResults method', () => {
    expect(searchService.getFilteredResults).toBeDefined();
  });
});