import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRowCreateBatchTransactionComponent } from './add-row-create-batch-transaction.component';

describe('AddRowCreateBatchTransactionComponent', () => {
  let component: AddRowCreateBatchTransactionComponent;
  let fixture: ComponentFixture<AddRowCreateBatchTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRowCreateBatchTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRowCreateBatchTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
