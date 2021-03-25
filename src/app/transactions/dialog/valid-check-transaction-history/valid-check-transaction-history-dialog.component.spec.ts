import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidCheckTransactionHistoryDialogComponent } from './valid-check-transaction-history-dialog.component';


describe('ValidCheckTransactionHistoryDialogComponent', () => {
  let component: ValidCheckTransactionHistoryDialogComponent;
  let fixture: ComponentFixture<ValidCheckTransactionHistoryDialogComponent>;

  beforeEach(async(() => {
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
