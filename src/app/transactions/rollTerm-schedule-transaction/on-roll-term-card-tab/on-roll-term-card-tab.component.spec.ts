import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnRollTermCardTabComponent } from './on-roll-term-card-tab.component';


describe('OnRollTermCardTabComponent', () => {
  let component: OnRollTermCardTabComponent;
  let fixture: ComponentFixture<OnRollTermCardTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnRollTermCardTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRollTermCardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
