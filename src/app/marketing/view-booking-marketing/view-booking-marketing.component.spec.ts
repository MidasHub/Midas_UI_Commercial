import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookingMarketingComponent } from './view-booking-marketing.component';

describe('ViewBookingMarketingComponent', () => {
  let component: ViewBookingMarketingComponent;
  let fixture: ComponentFixture<ViewBookingMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBookingMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookingMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
