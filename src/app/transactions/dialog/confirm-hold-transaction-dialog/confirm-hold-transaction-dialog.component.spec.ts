import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmHoldTransactionDialogComponent } from './confirm-hold-transaction-dialog.component';


describe('ConfirmHoldTransactionDialogComponent', () => {
  let component: ConfirmHoldTransactionDialogComponent;
  let fixture: ComponentFixture<ConfirmHoldTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmHoldTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmHoldTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
