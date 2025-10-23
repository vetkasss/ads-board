import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBarComponent } from './navigation-bar.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  const mockAuthService = { 
    isAuthenticated: false 
  };

  const mockRouter = { 
    navigate: jasmine.createSpy('navigate') 
  };

  const mockSearchService = {
    setSearchValue: jasmine.createSpy('setSearchValue'),
    search: jasmine.createSpy('search'),
    showRecommendationsMode: jasmine.createSpy('showRecommendationsMode'),
    resetSearch: jasmine.createSpy('resetSearch')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBarComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SearchService, useValue: mockSearchService }
      ]
    });

    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});