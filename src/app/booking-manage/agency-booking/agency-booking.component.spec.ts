import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingAgencyComponent } from './agency-booking.component';


describe('BookingAgencyComponent', () => {
  let component: BookingAgencyComponent;
  let fixture: ComponentFixture<BookingAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
