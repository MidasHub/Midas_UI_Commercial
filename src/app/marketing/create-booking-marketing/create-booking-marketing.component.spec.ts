import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingMarketingComponent } from './create-booking-marketing.component';

describe('CreateBookingMarketingComponent', () => {
  let component: CreateBookingMarketingComponent;
  let fixture: ComponentFixture<CreateBookingMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBookingMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBookingMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
