import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecuteLoanDialogComponent } from './execute-loan-dialog.component';


describe('ExecuteLoanDialogComponent', () => {
  let component: ExecuteLoanDialogComponent;
  let fixture: ComponentFixture<ExecuteLoanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteLoanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
