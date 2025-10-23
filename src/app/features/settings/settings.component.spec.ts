import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { DadataService } from '../../core/services/dadata.service';


const mockAuthService = {
  currentUser: {
    name: 'John Doe',
    phone: '+79991234567',
    address: 'Moscow'
  },
  updateProfile: () => of({}) 
};

const mockDadataService = {
  getAddressSuggestions: () => of({ suggestions: [] })
};

const mockRouter = {
  navigate: () => {}
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: DadataService, useValue: mockDadataService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService); 
    fixture.detectChanges();
  });

  // ТЕСТ 1: Проверка создания компонента
  it('должен создаваться и загружать данные пользователя', () => {
    
    expect(component).toBeTruthy(); 
    expect(component.form).toBeTruthy(); 
    
    expect(component.form.get('userData.firstName')?.value).toBe('John');
    expect(component.form.get('userData.lastName')?.value).toBe('Doe');
  });

  // ТЕСТ 2: Проверка сохранения профиля
  it('должен сохранять профиль при изменениях', () => {
    const updateProfileSpy = spyOn(authService, 'updateProfile').and.callThrough();
    component.form.patchValue({
      userData: { 
        firstName: 'Jane', 
        lastName: 'Smith' 
      }
    });

    component.saveProfile();
    expect(updateProfileSpy).toHaveBeenCalledWith({
      name: 'Jane Smith',
      phone: '+79991234567', 
      address: 'Moscow'
    });
  });
});