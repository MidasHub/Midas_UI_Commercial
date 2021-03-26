import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTransactionBookingComponent } from './create-transaction-booking.component';

describe('CreateTransactionBookingComponent', () => {
  let component: CreateTransactionBookingComponent;
  let fixture: ComponentFixture<CreateTransactionBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTransactionBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransactionBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
