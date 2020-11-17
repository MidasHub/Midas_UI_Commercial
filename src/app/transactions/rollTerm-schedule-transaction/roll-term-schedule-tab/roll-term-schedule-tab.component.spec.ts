import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RollTermScheduleTabComponent } from './roll-term-schedule-tab.component';


describe('RollTermScheduleTabComponent', () => {
  let component: RollTermScheduleTabComponent;
  let fixture: ComponentFixture<RollTermScheduleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTermScheduleTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTermScheduleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
