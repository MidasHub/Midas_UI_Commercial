import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RollTermScheduleBookingTabComponent } from './roll-term-schedule-booking-tab.component';


describe('RollTermScheduleBookingTabComponent', () => {
  let component: RollTermScheduleBookingTabComponent;
  let fixture: ComponentFixture<RollTermScheduleBookingTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTermScheduleBookingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTermScheduleBookingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
