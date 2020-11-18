import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeePaidTransactionDialogComponent } from './view-fee-paid-transaction-dialog.component';

describe('ViewFeePaidTransactionDialogComponent', () => {
  let component: ViewFeePaidTransactionDialogComponent;
  let fixture: ComponentFixture<ViewFeePaidTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFeePaidTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeePaidTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
