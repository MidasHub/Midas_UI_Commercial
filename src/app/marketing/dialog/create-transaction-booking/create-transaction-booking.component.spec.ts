import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionBookingComponent } from './create-transaction-booking.component';

describe('CreateTransactionBookingComponent', () => {
  let component: CreateTransactionBookingComponent;
  let fixture: ComponentFixture<CreateTransactionBookingComponent>;

  beforeEach(async(() => {
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
