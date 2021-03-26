import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TransactionHistoryDialogComponent } from './transaction-history-dialog.component';


describe('TransactionHistoryDialogComponent', () => {
  let component: TransactionHistoryDialogComponent;
  let fixture: ComponentFixture<TransactionHistoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
