import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchBookingTabComponent } from './branch-booking-tab.component';

describe('BranchBookingTabComponent', () => {
  let component: BranchBookingTabComponent;
  let fixture: ComponentFixture<BranchBookingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchBookingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchBookingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
