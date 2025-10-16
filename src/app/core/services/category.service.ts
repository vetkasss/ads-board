import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, catchError, of, tap } from 'rxjs';
import { Category } from '../models/category.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://dzitskiy.ru:5000/Categories';
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string>('');
  public error$ = this.errorSubject.asObservable();
  
  private categoriesLoaded = false;

  loadCategories(): Observable<Category[]> {
    if (this.categoriesLoaded) {
      return of(this.categoriesSubject.value);
    }

    this.loadingSubject.next(true);
    this.errorSubject.next('');

    return this.http.get<any[]>(this.apiUrl).pipe(
      map(categories => this.buildCategoryTree(categories)),
      tap(categories => {
        this.categoriesSubject.next(categories);
        this.categoriesLoaded = true;
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error loading categories from API:', error);
        this.errorSubject.next('Не удалось загрузить категории');
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  reloadCategories(): Observable<Category[]> {
    this.categoriesLoaded = false;
    return this.loadCategories();
  }

  private buildCategoryTree(categories: any[]): Category[] {
    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        parentId: cat.parentId,
        children: []
      });
    });

    categories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        const parent = categoryMap.get(cat.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(category);
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  }
}