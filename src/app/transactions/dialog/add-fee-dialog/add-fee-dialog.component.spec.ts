import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddFeeDialogComponent } from './add-fee-dialog.component';

describe('AddFeeDialogComponent', () => {
  let component: AddFeeDialogComponent;
  let fixture: ComponentFixture<AddFeeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
