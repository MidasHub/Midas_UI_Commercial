import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBookingInternalComponent } from './add-booking-internal.component';

describe('AddBookingInternalComponent', () => {
  let component: AddBookingInternalComponent;
  let fixture: ComponentFixture<AddBookingInternalComponent>;

  beforeEach(async(() => {
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
