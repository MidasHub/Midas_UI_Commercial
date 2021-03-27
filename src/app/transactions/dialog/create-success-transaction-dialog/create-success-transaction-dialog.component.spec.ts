import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSuccessTransactionDialogComponent } from './create-success-transaction-dialog.component';


describe('CreateSuccessTransactionDialogComponent', () => {
  let component: CreateSuccessTransactionDialogComponent;
  let fixture: ComponentFixture<CreateSuccessTransactionDialogComponent>;

  beforeEach(async(() => {
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
