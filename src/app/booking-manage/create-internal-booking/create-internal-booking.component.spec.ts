import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInternalBookingComponent } from './create-internal-booking.component';


describe('CreateInternalBookingComponent', () => {
  let component: CreateInternalBookingComponent;
  let fixture: ComponentFixture<CreateInternalBookingComponent>;

  beforeEach(async(() => {
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
