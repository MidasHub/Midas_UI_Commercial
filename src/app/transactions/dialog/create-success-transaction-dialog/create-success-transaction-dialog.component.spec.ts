import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateSuccessTransactionDialogComponent } from './create-success-transaction-dialog.component';


describe('CreateSuccessTransactionDialogComponent', () => {
  let component: CreateSuccessTransactionDialogComponent;
  let fixture: ComponentFixture<CreateSuccessTransactionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSuccessTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuccessTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
