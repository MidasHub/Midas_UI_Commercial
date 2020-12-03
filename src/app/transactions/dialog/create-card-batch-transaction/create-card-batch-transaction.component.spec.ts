import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardBatchTransactionComponent } from './create-card-batch-transaction.component';

describe('CreateCardBatchTransactionComponent', () => {
  let component: CreateCardBatchTransactionComponent;
  let fixture: ComponentFixture<CreateCardBatchTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCardBatchTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCardBatchTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
