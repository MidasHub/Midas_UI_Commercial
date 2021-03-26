import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBookingMarketingComponent } from './create-booking-marketing.component';

describe('CreateBookingMarketingComponent', () => {
  let component: CreateBookingMarketingComponent;
  let fixture: ComponentFixture<CreateBookingMarketingComponent>;

  beforeEach(waitForAsync(() => {
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
