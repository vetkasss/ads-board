import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchService } from 'src/app/core/services/search.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockSearchService = { 
    resetSearch: jasmine.createSpy('resetSearch'),
    setSearchValue: jasmine.createSpy('setSearchValue'),
    search: jasmine.createSpy('search'),
    showRecommendationsMode: jasmine.createSpy('showRecommendationsMode')
  };

  const mockAuthService = { 
    isAuthenticated: false 
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SearchService, useValue: mockSearchService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});