import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });
  
  isLoading = false;
  errorMessage: string | null = null;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadRememberedPhone();
  }

  private loadRememberedPhone(): void {
    try {
      const remembered = localStorage.getItem('rememberedUser');
      if (remembered) {
        const userData = JSON.parse(remembered);
        if (userData.phone) {
          this.loginForm.patchValue({
            phone: userData.phone
          });
        }
      }
    } catch (error) {
      console.warn('Ошибка загрузки сохраненного телефона:', error);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { phone, password, rememberMe } = this.loginForm.value;
      
      const loginData: LoginRequest = {
        phone: phone.trim(),
        password: password
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.isLoading = false;
          if (rememberMe) {
            
            localStorage.setItem('rememberedUser', JSON.stringify({ phone }));
          } else {
            localStorage.removeItem('rememberedUser');
          }
          this.closeDialog.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }

  private getErrorMessage(error: any): string {
    if (error.message?.includes('неверный') || error.message?.includes('invalid')) {
      return 'Неверный номер телефона или пароль';
    } else if (error.status === 0) {
      return 'Ошибка соединения с сервером';
    } else {
      return 'Ошибка входа. Проверьте данные и попробуйте снова';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get phone() { return this.loginForm.get('phone'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
}