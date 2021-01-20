import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExecuteLoanDialogComponent } from './execute-loan-dialog.component';


describe('ExecuteLoanDialogComponent', () => {
  let component: ExecuteLoanDialogComponent;
  let fixture: ComponentFixture<ExecuteLoanDialogComponent>;

  beforeEach(waitForAsync(() => {
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
