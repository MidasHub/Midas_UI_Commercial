import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReceiveInsuranceComponent } from "./receive-insurance.component";

describe("ReceiveInsuranceComponent", () => {
  let component: ReceiveInsuranceComponent;
  let fixture: ComponentFixture<ReceiveInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveInsuranceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
