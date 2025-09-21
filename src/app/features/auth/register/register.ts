import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isLoading = false;

  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() switchToLogin = new EventEmitter<void>(); 

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.value;
      const registerData: RegisterData = {
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
        confirmPassword: formValue.confirmPassword ?? ''
      };
      console.log('Регистрация:', registerData);
      this.isLoading = false;
      this.closeDialog.emit();
    }
  }

  onSwitchToLogin(): void {
    this.switchToLogin.emit(); 
  }
}