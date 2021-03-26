import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadBillComponent } from './upload-bill.component';

describe('UploadBillComponent', () => {
  let component: UploadBillComponent;
  let fixture: ComponentFixture<UploadBillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
