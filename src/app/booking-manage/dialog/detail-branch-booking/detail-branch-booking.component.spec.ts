import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailBranchBookingDialogComponent } from './detail-branch-booking.component';


describe('DetailBranchBookingDialogComponent', () => {
  let component: DetailBranchBookingDialogComponent;
  let fixture: ComponentFixture<DetailBranchBookingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBranchBookingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBranchBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
