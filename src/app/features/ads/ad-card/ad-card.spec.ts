import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdCardComponent } from './ad-card';

describe('AdCardComponent', () => {
  let component: AdCardComponent;
  let fixture: ComponentFixture<AdCardComponent>;

  const mockAd = {
    id: '1',
    title: 'Test Ad',
    price: 1000,
    location: 'Moscow',
    date: new Date().toISOString(),
    imageUrl: 'test.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('ad', mockAd);
    
    fixture.detectChanges(); 
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

});