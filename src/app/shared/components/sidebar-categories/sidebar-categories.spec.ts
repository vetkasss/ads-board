import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SidebarCategoriesComponent } from './sidebar-categories.component';
import { CategoryService } from 'src/app/core/services/category.service';

describe('SidebarCategoriesComponent', () => {
  let component: SidebarCategoriesComponent;
  let fixture: ComponentFixture<SidebarCategoriesComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  const mockCategories = [
    { id: '1', name: 'Electronics', parentId: null, children: [] },
    {
      id: '2',
      name: 'Transport',
      parentId: null,
      children: [
        { id: '21', name: 'Cars', parentId: '2', children: [] },
        { id: '22', name: 'Bikes', parentId: '2', children: [] }
      ]
    }
  ];

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['loadCategories']);

    await TestBed.configureTestingModule({
      imports: [SidebarCategoriesComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarCategoriesComponent);
    component = fixture.componentInstance;
  });

  it('создаётся', () => {
    expect(component).toBeTruthy();
  });

  it('загружает категории при инициализации', () => {
    mockCategoryService.loadCategories.and.returnValue(of(mockCategories));
    fixture.detectChanges();

    expect(mockCategoryService.loadCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
    expect(component.loading).toBeFalse();
  });

  it('эмитит closed при вызове close()', () => {
    spyOn(component.closed, 'emit');
    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('выбирает категорию без подкатегорий', () => {
    spyOn(component.categorySelected, 'emit');
    const category = mockCategories[0]; 

    component.selectCategory(category);

    expect(component.selectedCategoryId).toBe('1');
    expect(component.selectedSubcategoryId).toBeNull();
    expect(component.categorySelected.emit).toHaveBeenCalledWith({
      categoryName: 'Electronics',
      categoryId: '1'
    });
  });

  it('выбирает подкатегорию', () => {
    spyOn(component.categorySelected, 'emit');
    const parent = mockCategories[1]; // Transport
    const sub = parent.children![0];   // Cars

    component.selectSubcategory(parent, sub);

    expect(component.selectedCategoryId).toBe('2');
    expect(component.selectedSubcategoryId).toBe('21');
    expect(component.categorySelected.emit).toHaveBeenCalledWith({
      categoryName: 'Transport',
      categoryId: '2',
      subcategoryName: 'Cars',
      subcategoryId: '21'
    });
  });

  it('переключает категорию с детьми (открывает/закрывает)', () => {
    const transport = mockCategories[1];

    component.toggleCategory(transport);
    expect(component.openedCategoryId).toBe('2');

    component.toggleCategory(transport);
    expect(component.openedCategoryId).toBeNull();
  });

  it('показывает ошибку при неудачной загрузке', () => {
    mockCategoryService.loadCategories.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Не удалось загрузить категории');
  });
});