import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditBookingInternalComponent } from './edit-booking-internal.component';

describe('EditBookingInternalComponent', () => {
  let component: EditBookingInternalComponent;
  let fixture: ComponentFixture<EditBookingInternalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBookingInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookingInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
