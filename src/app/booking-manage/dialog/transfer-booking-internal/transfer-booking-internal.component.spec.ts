import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TransferBookingInternalComponent } from "./transfer-booking-internal.component";

describe("TransferBookingInternalComponent", () => {
  let component: TransferBookingInternalComponent;
  let fixture: ComponentFixture<TransferBookingInternalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransferBookingInternalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBookingInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
