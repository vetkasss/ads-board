import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('phone')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });
  it('should validate phone field', () => {
  const phoneControl = component.loginForm.get('phone');
  phoneControl?.setValue('');
  expect(phoneControl?.valid).toBeFalse();
  expect(phoneControl?.errors?.['required']).toBeTruthy();
});

it('should validate password min length', () => {
  const passwordControl = component.loginForm.get('password');
  passwordControl?.setValue('123');
  expect(passwordControl?.valid).toBeFalse();
  expect(passwordControl?.errors?.['minlength']).toBeTruthy();
});
});