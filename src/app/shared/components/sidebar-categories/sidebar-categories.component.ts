import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.models';

@Component({
  selector: 'app-sidebar-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-categories.component.html',
  styleUrls: ['./sidebar-categories.component.scss']
})
export class SidebarCategoriesComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<{ 
    categoryName: string; 
    categoryId: string;
    subcategoryName?: string;
    subcategoryId?: string;
  }>();

  categories: Category[] = [];
  loading = false;
  error = '';

  openedCategoryId: string | null = null;
  selectedCategoryId: string | null = null;
  selectedSubcategoryId: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categoryService.loadCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
        if (categories.length === 0) {
          this.error = 'Категории временно недоступны';
        }
      },
      error: (error) => {
        this.error = 'Не удалось загрузить категории';
        this.loading = false;
        console.error('Ошибка загрузки:', error);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  toggleCategory(category: Category): void {
    if (this.hasChildren(category)) {
      this.openedCategoryId = this.openedCategoryId === category.id ? null : category.id;
    } else {
      this.selectCategory(category);
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategoryId = category.id;
    this.selectedSubcategoryId = null;

    this.categorySelected.emit({
      categoryName: category.name,
      categoryId: category.id
    });
  }

  selectSubcategory(parentCategory: Category, subcategory: Category): void {
    this.selectedCategoryId = parentCategory.id;
    this.selectedSubcategoryId = subcategory.id;

    this.categorySelected.emit({
      categoryName: parentCategory.name,
      categoryId: parentCategory.id,
      subcategoryName: subcategory.name,
      subcategoryId: subcategory.id
    });
  }

  hasChildren(category: Category): boolean {
    return !!(category.children && category.children.length > 0);
  }
}