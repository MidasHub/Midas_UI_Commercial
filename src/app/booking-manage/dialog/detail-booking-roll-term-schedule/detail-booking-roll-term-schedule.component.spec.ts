import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DetailBookingRollTermScheduleComponent } from './detail-booking-roll-term-schedule.component';

describe('DetailBookingRollTermScheduleComponent', () => {
  let component: DetailBookingRollTermScheduleComponent;
  let fixture: ComponentFixture<DetailBookingRollTermScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBookingRollTermScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBookingRollTermScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
