import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PartnerTabComponent } from './partner-tab.component';


describe('PartnerTabComponent', () => {
  let component: PartnerTabComponent;
  let fixture: ComponentFixture<PartnerTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
