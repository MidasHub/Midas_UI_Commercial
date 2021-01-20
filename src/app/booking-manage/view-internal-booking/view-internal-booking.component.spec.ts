import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewInternalBookingComponent } from './view-internal-booking.component';


describe('ViewInternalBookingComponent', () => {
  let component: ViewInternalBookingComponent;
  let fixture: ComponentFixture<ViewInternalBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInternalBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInternalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
