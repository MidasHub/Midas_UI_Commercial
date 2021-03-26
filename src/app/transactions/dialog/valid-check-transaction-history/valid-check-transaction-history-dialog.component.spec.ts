import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ValidCheckTransactionHistoryDialogComponent } from './valid-check-transaction-history-dialog.component';


describe('ValidCheckTransactionHistoryDialogComponent', () => {
  let component: ValidCheckTransactionHistoryDialogComponent;
  let fixture: ComponentFixture<ValidCheckTransactionHistoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidCheckTransactionHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidCheckTransactionHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
