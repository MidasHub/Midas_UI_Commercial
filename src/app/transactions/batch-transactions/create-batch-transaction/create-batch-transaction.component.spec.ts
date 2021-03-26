import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBatchTransactionComponent } from './create-batch-transaction.component';

describe('CreateBatchTransactionComponent', () => {
  let component: CreateBatchTransactionComponent;
  let fixture: ComponentFixture<CreateBatchTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
