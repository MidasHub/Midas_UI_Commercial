import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcPartnerTabComponent } from './ic-partner-tab.component';

describe('IcPartnerTabComponent', () => {
  let component: IcPartnerTabComponent;
  let fixture: ComponentFixture<IcPartnerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcPartnerTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcPartnerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
