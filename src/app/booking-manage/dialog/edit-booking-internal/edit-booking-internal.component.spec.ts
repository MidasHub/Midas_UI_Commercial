import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBookingInternalComponent } from './edit-booking-internal.component';

describe('EditBookingInternalComponent', () => {
  let component: EditBookingInternalComponent;
  let fixture: ComponentFixture<EditBookingInternalComponent>;

  beforeEach(async(() => {
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
