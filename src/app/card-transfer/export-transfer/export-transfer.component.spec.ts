import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTransferComponent } from './export-transfer.component';

describe('ExportTransferComponent', () => {
  let component: ExportTransferComponent;
  let fixture: ComponentFixture<ExportTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
