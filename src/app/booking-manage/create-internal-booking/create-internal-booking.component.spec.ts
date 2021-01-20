import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateInternalBookingComponent } from './create-internal-booking.component';


describe('CreateInternalBookingComponent', () => {
  let component: CreateInternalBookingComponent;
  let fixture: ComponentFixture<CreateInternalBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInternalBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInternalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
