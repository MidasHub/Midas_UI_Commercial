import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RollTermScheduleDialogComponent } from './roll-term-schedule-dialog.component';


describe('RollTermScheduleDialogComponent', () => {
  let component: RollTermScheduleDialogComponent;
  let fixture: ComponentFixture<RollTermScheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTermScheduleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTermScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
