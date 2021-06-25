import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTransferComponent } from './request-transfer.component';

describe('RequestTransferComponent', () => {
  let component: RequestTransferComponent;
  let fixture: ComponentFixture<RequestTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
