import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryDialogComponent } from './transaction-history-dialog.component';


describe('TransactionHistoryDialogComponent', () => {
  let component: TransactionHistoryDialogComponent;
  let fixture: ComponentFixture<TransactionHistoryDialogComponent>;

  beforeEach(async(() => {
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
