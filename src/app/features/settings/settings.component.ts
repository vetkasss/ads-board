import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth/auth.service';
import { DadataService } from '../../core/services/dadata.service';
import { UserData, PasswordData, initialSettingsForm } from 'src/app/core/models/setting-form.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dadataService = inject(DadataService);

  form: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);
  saveSuccess = signal(false);
  passwordSuccess = signal(false);
  citySuggestions = signal<any[]>([]);
  showCityDropdown = signal(false);

  private originalUserData: UserData = initialSettingsForm.userData;

  private citySearchSub?: Subscription;

  constructor() {
    this.form = this.fb.group({
      userData: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phone: [''],
        address: ['']
      }),
      passwordData: this.fb.group({
        currentPassword: [''],
        newPassword: ['']
      })
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupAddressAutocomplete();
  }

  ngOnDestroy(): void {
    this.citySearchSub?.unsubscribe();
  }

  private setupAddressAutocomplete(): void {
    const addressControl = this.form.get('userData.address');
    if (!addressControl) return;

    this.citySearchSub = addressControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.length > 2) {
          return this.dadataService.getAddressSuggestions(query);
        }
        this.citySuggestions.set([]);
        return [];
      })
    ).subscribe({
      next: (response) => {
        this.citySuggestions.set(response.suggestions || []);
        this.showCityDropdown.set(this.citySuggestions().length > 0);
      },
      error: () => {
        this.citySuggestions.set([]);
      }
    });
  }

  private loadUserData(): void {
    const user = this.authService.currentUser;
    if (user) {
      const names = user.name?.split(' ') || ['', ''];
      const userData = {
        firstName: names[0] || '',
        lastName: names[1] || '',
        phone: user.phone || '',
        address: user.address || ''
      };
      this.form.patchValue({ userData });
      this.originalUserData = { ...userData };
    }
  }

  selectAddress(suggestion: any): void {
    const address = suggestion.value;
    this.form.patchValue({ userData: { address } });
    this.citySuggestions.set([]);
    this.showCityDropdown.set(false);
  }

  closeCityDropdown(): void {
    setTimeout(() => this.showCityDropdown.set(false), 200);
  }

  hasUserChanges(): boolean {
    const currentData = this.form.value.userData;
    return Object.keys(this.originalUserData).some(key => 
      currentData[key] !== this.originalUserData[key as keyof UserData]
    );
  }

  hasPasswordChanges(): boolean {
    const passwordData = this.form.value.passwordData;
    return passwordData.currentPassword && passwordData.newPassword;
  }

  isPasswordValid(): boolean {
    const newPassword = this.form.value.passwordData.newPassword;
    return !newPassword || newPassword.length >= 8;
  }

  saveProfile(): void {
    if (!this.hasUserChanges()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);

    const userData = this.form.value.userData;

    const profileData = {
      name: `${userData.firstName} ${userData.lastName}`.trim(),
      phone: userData.phone,
      address: userData.address
    };

    this.authService.updateProfile(profileData).subscribe({
      next: (updatedUser) => {
        this.isLoading.set(false);
        this.originalUserData = { ...userData };
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => this.handleError(error)
    });
  }

  changePassword(): void {
    if (!this.hasPasswordChanges() || !this.isPasswordValid()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.passwordSuccess.set(false);

    const { currentPassword, newPassword } = this.form.value.passwordData;

    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.form.patchValue({ passwordData: { currentPassword: '', newPassword: '' } });
        this.passwordSuccess.set(true);
        setTimeout(() => this.passwordSuccess.set(false), 3000);
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    this.isLoading.set(false);
    this.error.set(error.message || 'Ошибка при сохранении');
  }

  clearError(): void {
    this.error.set(null);
  }
}