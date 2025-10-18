import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneDialogComponent } from './phone-dialog.component';

describe('PhoneDialogComponent', () => {
  let component: PhoneDialogComponent;
  let fixture: ComponentFixture<PhoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
