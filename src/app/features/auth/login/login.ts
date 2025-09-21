import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../../../core/services/auth.service';

interface LoginData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router); 

  loginForm: FormGroup;
  isLoading = false;

  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() switchToRegister = new EventEmitter<void>(); 

  constructor() {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9+\\- ]{10,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const formValue = this.loginForm.value;
      const loginData: LoginData = {
        phone: formValue.phone ?? '',
        password: formValue.password ?? '',
        rememberMe: formValue.rememberMe ?? false
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (loginData.rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ phone: loginData.phone }));
          }
          this.closeDialog.emit();
          this.router.navigate(['/profile']); 
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Ошибка входа:', error);
        }
      });
    }
  }

  onSwitchToRegister(): void {
    this.switchToRegister.emit(); 
  }
}