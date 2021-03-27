import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailBookingRollTermScheduleComponent } from './detail-booking-roll-term-schedule.component';

describe('DetailBookingRollTermScheduleComponent', () => {
  let component: DetailBookingRollTermScheduleComponent;
  let fixture: ComponentFixture<DetailBookingRollTermScheduleComponent>;

  beforeEach(async(() => {
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
