import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchTransactionComponent } from './create-batch-transaction.component';

describe('CreateBatchTransactionComponent', () => {
  let component: CreateBatchTransactionComponent;
  let fixture: ComponentFixture<CreateBatchTransactionComponent>;

  beforeEach(async(() => {
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
