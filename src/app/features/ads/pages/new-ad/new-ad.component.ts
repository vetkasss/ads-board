import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { StoreService } from 'src/app/core/services/store/store.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { DadataService } from 'src/app/core/services/dadata.service';
import { Ad } from 'src/app/core/models/ad.model';
import { Category } from 'src/app/core/models/category.models';

interface UploadedFile {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-new-ad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.scss']
})
export class NewAdComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private storeService = inject(StoreService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private dadataService = inject(DadataService);
  private addressSubscription?: Subscription;

  formGroup!: FormGroup;
  isSubmitting = false;
  formSubmitted = false;

  categories: Category[] = [];
  dropdownState = {
    category: false,
    subcategory: false
  };
  selectedCategory: Category | null = null;
  selectedSubcategory: Category | null = null;

  readonly maxImages = 10;
  readonly maxSize = 5 * 1024 * 1024;
  readonly validImageTypes = ['image/jpeg', 'image/png', 'image/heic'];
  uploadedFiles: UploadedFile[] = [];

  addressSuggestions: any[] = [];
  showAddressDropdown = false;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      location: ['', Validators.required],
      price: [null, [Validators.min(0), Validators.pattern(/^\d+$/)]],
      categoryPath: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.setupAddressAutocomplete();
    this.loadCategories();
    this.prefillUserAddress();
  }

  ngOnDestroy(): void {
    this.addressSubscription?.unsubscribe();
    this.cleanupFilePreviews();
  }

  private cleanupFilePreviews(): void {
    this.uploadedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
  }

  private prefillUserAddress(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser?.address) {
      this.formGroup.patchValue({ location: currentUser.address });
    }
  }

  private loadCategories(): void {
    this.categoryService.loadCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  private setupAddressAutocomplete(): void {
    const locationControl = this.formGroup.get('location');
    if (!locationControl) return;

    this.addressSubscription = locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query && query.length > 2),
      switchMap(query => this.dadataService.getAddressSuggestions(query))
    ).subscribe({
      next: (response) => {
        this.addressSuggestions = response.suggestions || [];
        this.showAddressDropdown = this.addressSuggestions.length > 0;
      },
      error: () => {
        this.addressSuggestions = [];
        this.showAddressDropdown = false;
      }
    });
  }

  selectAddress(suggestion: any): void {
    this.formGroup.patchValue({ location: suggestion.value });
    this.showAddressDropdown = false;
  }

  closeAddressDropdown(): void {
    setTimeout(() => {
      this.showAddressDropdown = false;
    }, 200);
  }

  toggleDropdown(level: 'category' | 'subcategory', event?: Event): void {
    event?.stopPropagation();
    
    if (level === 'subcategory' && (!this.selectedCategory || !this.hasSubcategories)) {
      return;
    }
    
    this.dropdownState[level] = !this.dropdownState[level];
  }

  selectCategory(category: Category, event: Event): void {
    event.stopPropagation();
    this.selectedCategory = category;
    this.selectedSubcategory = null;
    this.formGroup.patchValue({ 
      categoryPath: [category.name] 
    });
    this.dropdownState.category = false;
    this.dropdownState.subcategory = false;
  }

  selectSubcategory(subcategory: Category, event: Event): void {
    event.stopPropagation();
    this.selectedSubcategory = subcategory;
    this.formGroup.patchValue({ 
      categoryPath: [this.selectedCategory!.name, subcategory.name] 
    });
    this.dropdownState.subcategory = false;
  }

  closeAllDropdowns(): void {
    this.dropdownState.category = false;
    this.dropdownState.subcategory = false;
    this.showAddressDropdown = false;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    if (!files.length) return;

    const availableSlots = this.maxImages - this.uploadedFiles.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`Можно загрузить только ${availableSlots} изображений`);
    }

    const invalidFiles: string[] = [];

    filesToProcess.forEach(file => {
      if (file.size > this.maxSize) {
        invalidFiles.push(`"${file.name}" (превышает 5MB)`);
        return;
      }
      
      if (!this.validImageTypes.includes(file.type)) {
        invalidFiles.push(`"${file.name}" (неверный формат)`);
        return;
      }

      // Используем Blob URL 
      const preview = URL.createObjectURL(file);
      this.uploadedFiles.push({ file, preview });
    });

    if (invalidFiles.length > 0) {
      alert(`Следующие файлы не были загружены:\n${invalidFiles.join('\n')}`);
    }

    input.value = '';
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();
    URL.revokeObjectURL(this.uploadedFiles[index].preview);
    this.uploadedFiles.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;
    
    if (this.formGroup.invalid) {
      this.markAllFieldsAsTouched();
      this.scrollToFirstError();
      return;
    }

    if (this.uploadedFiles.length === 0) {
      const proceed = confirm('Вы не добавили фотографии. Продолжить без фото?');
      if (!proceed) return;
    }

    this.isSubmitting = true;

    try {
      // Конвертируем файлы в Base64 только при отправке
      const galleryImages = await this.convertFilesToBase64();
      const imageUrl = galleryImages[0] || '';

      const newAd: Ad = {
        id: this.generateAdId(),
        title: this.formGroup.value.title.trim(),
        description: (this.formGroup.value.description || '').trim(),
        price: Number(this.formGroup.value.price) || 0,
        location: this.formGroup.value.location.trim(),
        imageUrl,
        galleryImages,
        category: this.formGroup.value.categoryPath[0],
        subcategory: this.formGroup.value.categoryPath[1],
        userId: this.authService.currentUser!.id,
        date: new Date().toISOString(),
        views: 0,
        isFavorite: false
      };

      this.storeService.addAd(newAd);
      this.router.navigate(['/ads', newAd.id]);
      
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Произошла ошибка при создании объявления');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async convertFilesToBase64(): Promise<string[]> {
    const base64Promises = this.uploadedFiles.map(fileData => 
      this.fileToBase64(fileData.file)
    );
    return await Promise.all(base64Promises);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.error-message');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  private generateAdId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  get hasSubcategories(): boolean {
    return !!this.selectedCategory?.children?.length;
  }

  get subcategoryText(): string {
    if (!this.selectedCategory) return 'Сначала выберите категорию';
    if (!this.hasSubcategories) return 'Нет подкатегорий';
    return this.selectedSubcategory ? this.selectedSubcategory.name : 'Выберите подкатегорию';
  }

  get titleError(): string {
    const control = this.formGroup.get('title');
    if (control?.errors?.['required'] && control.touched) {
      return 'Название обязательно для заполнения';
    }
    if (control?.errors?.['minlength'] && control.touched) {
      return 'Название должно содержать минимум 3 символа';
    }
    if (control?.errors?.['maxlength'] && control.touched) {
      return 'Название не должно превышать 100 символов';
    }
    return '';
  }

  get locationError(): string {
    const control = this.formGroup.get('location');
    if (control?.errors?.['required'] && control.touched) {
      return 'Адрес обязателен для заполнения';
    }
    return '';
  }

  get categoryError(): string {
    const control = this.formGroup.get('categoryPath');
    if (!control?.value.length && this.formSubmitted) {
      return 'Пожалуйста, выберите категорию';
    }
    return '';
  }
}