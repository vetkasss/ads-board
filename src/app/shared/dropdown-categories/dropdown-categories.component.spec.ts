import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCategoriesComponent } from './dropdown-categories.component';

describe('DropdownCategoriesComponent', () => {
  let component: DropdownCategoriesComponent;
  let fixture: ComponentFixture<DropdownCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
