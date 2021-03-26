import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageTransactionComponent } from './manage-transaction.component';

describe('ManageTransactionComponent', () => {
  let component: ManageTransactionComponent;
  let fixture: ComponentFixture<ManageTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
