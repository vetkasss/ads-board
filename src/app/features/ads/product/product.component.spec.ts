import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductComponent } from './product.component';
import { AdService } from '../../../core/services/ads/ad.service';
import { StoreService } from '../../../core/services/store/store.service';
import { Ad } from '../../../core/models/ad.model';

// Mock services
const mockAdService = {
  getAdvertisementById: jasmine.createSpy('getAdvertisementById').and.returnValue(of({
    id: '1',
    title: 'Test Ad',
    price: 1000,
    location: 'Moscow',
    category: 'Electronics',
    subcategory: 'Phones',
    imageUrl: 'test.jpg',
    date: new Date().toISOString()
  } as Ad))
};

const mockStoreService = {
  getAdById: jasmine.createSpy('getAdById').and.returnValue(null),
  currentUser: null
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('1')
    }
  }
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: AdService, useValue: mockAdService },
        { provide: StoreService, useValue: mockStoreService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});