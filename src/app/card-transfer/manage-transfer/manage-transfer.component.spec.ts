import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTransferComponent } from './manage-transfer.component';

describe('ManageTransferComponent', () => {
  let component: ManageTransferComponent;
  let fixture: ComponentFixture<ManageTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
