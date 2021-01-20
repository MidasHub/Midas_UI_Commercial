import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateRollTermScheduleDialogComponent } from './create-roll-term-schedule-dialog.component';


describe('CreateRollTermScheduleDialogComponent', () => {
  let component: CreateRollTermScheduleDialogComponent;
  let fixture: ComponentFixture<CreateRollTermScheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRollTermScheduleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRollTermScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
