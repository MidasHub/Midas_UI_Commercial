import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddBookingInternalComponent } from './add-booking-internal.component';

describe('AddBookingInternalComponent', () => {
  let component: AddBookingInternalComponent;
  let fixture: ComponentFixture<AddBookingInternalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBookingInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookingInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
