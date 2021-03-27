import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalBookingTabComponent } from './internal-booking-tab.component';

describe('InternalBookingTabComponent', () => {
  let component: InternalBookingTabComponent;
  let fixture: ComponentFixture<InternalBookingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalBookingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalBookingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
