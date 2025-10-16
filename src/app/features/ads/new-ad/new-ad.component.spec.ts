import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NewAdComponent } from './new-ad.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { DadataService } from '../../../core/services/dadata.service';
import { StoreService } from '../../../core/services/store/store.service';

// Mock services
const mockAuthService = {
  isAuthenticated: true,
  currentUser: { id: 1, address: 'Moscow' }
};

const mockCategoryService = {
  loadCategories: jasmine.createSpy('loadCategories').and.returnValue(of([]))
};

const mockDadataService = {
  getAddressSuggestions: jasmine.createSpy('getAddressSuggestions').and.returnValue(of({ suggestions: [] }))
};

const mockStoreService = {
  addAd: jasmine.createSpy('addAd')
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('NewAdComponent', () => {
  let component: NewAdComponent;
  let fixture: ComponentFixture<NewAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAdComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: DadataService, useValue: mockDadataService },
        { provide: StoreService, useValue: mockStoreService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.formGroup).toBeTruthy();
    expect(component.formGroup.contains('title')).toBeTrue();
  });
});