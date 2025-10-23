import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonAuthComponent } from './button-auth.component';
import { ModalService } from 'src/app/core/services/modal.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SearchService } from 'src/app/core/services/search.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ButtonAuthComponent', () => {
  let component: ButtonAuthComponent;
  let fixture: ComponentFixture<ButtonAuthComponent>;

  const mockModalService = { 
    open: jasmine.createSpy('open') 
  };

  const mockAuthService = { 
    isAuthenticated: false,
    currentUser$: of(null),
    logout: jasmine.createSpy('logout')
  };

  const mockSearchService = { 
    resetSearch: jasmine.createSpy('resetSearch') 
  };

  const mockRouter = { 
    navigate: jasmine.createSpy('navigate') 
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAuthComponent],
      providers: [
        { provide: ModalService, useValue: mockModalService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(ButtonAuthComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});