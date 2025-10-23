import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
 

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  errorMessage: string | null = null;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  get name() { return this.registerForm.get('name'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { name, phone, password } = this.registerForm.value;
   
      const registerData: RegisterRequest = {
        phone: phone.trim(),
        name: name.trim(),
        password: password
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeDialog.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }

  private getErrorMessage(error: any): string {
    if (error.message?.includes('уже существует') || error.message?.includes('already exists')) {
      return 'Пользователь с таким номером телефона уже существует';
    } else if (error.message?.includes('неверный') || error.message?.includes('invalid')) {
      return 'Неверный формат данных';
    } else if (error.status === 0) {
      return 'Ошибка соединения с сервером';
    } else {
      return 'Ошибка регистрации. Попробуйте другой номер телефона';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  onFormChange(): void {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }
}