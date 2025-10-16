import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { DadataService } from '../../core/services/dadata.service';

// Mock services
const mockAuthService = {
  currentUser: {
    name: 'John Doe',
    phone: '+79991234567',
    address: 'Moscow'
  },
  updateProfile: () => of({}) // возвращает успешный Observable
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
    authService = TestBed.inject(AuthService); // Получаем сервис из DI
    fixture.detectChanges();
  });

  // ТЕСТ 1: Проверка создания компонента
  it('должен создаваться и загружать данные пользователя', () => {
    // Этот тест проверяет:
    // 1. Компонент успешно создан
    // 2. Форма инициализирована
    // 3. Данные пользователя загружены в форму
    
    expect(component).toBeTruthy(); // компонент создан
    expect(component.form).toBeTruthy(); // форма существует
    
    // Проверяем, что данные пользователя загружены в форму
    expect(component.form.get('userData.firstName')?.value).toBe('John');
    expect(component.form.get('userData.lastName')?.value).toBe('Doe');
  });

  // ТЕСТ 2: Проверка сохранения профиля
  it('должен сохранять профиль при изменениях', () => {
    // Создаем spy на методе updateProfile
    const updateProfileSpy = spyOn(authService, 'updateProfile').and.callThrough();
    
    // Меняем данные в форме
    component.form.patchValue({
      userData: { 
        firstName: 'Jane', 
        lastName: 'Smith' 
      }
    });

    // Вызываем метод сохранения
    component.saveProfile();

    // Проверяем, что сервис был вызван с правильными данными
    expect(updateProfileSpy).toHaveBeenCalledWith({
      name: 'Jane Smith',
      phone: '+79991234567', 
      address: 'Moscow'
    });
  });
});