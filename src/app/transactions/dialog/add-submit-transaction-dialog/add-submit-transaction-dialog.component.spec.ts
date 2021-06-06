import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSubmitTransactionDialogComponent } from './add-submit-transaction-dialog.component';

describe('AddSubmitTransactionDialogComponent', () => {
  let component: AddSubmitTransactionDialogComponent;
  let fixture: ComponentFixture<AddSubmitTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubmitTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubmitTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
