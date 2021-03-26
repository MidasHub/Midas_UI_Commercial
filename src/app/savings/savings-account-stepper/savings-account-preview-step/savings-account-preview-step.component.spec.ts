import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavingsAccountPreviewStepComponent } from './savings-account-preview-step.component';

describe('SavingsAccountPreviewStepComponent', () => {
  let component: SavingsAccountPreviewStepComponent;
  let fixture: ComponentFixture<SavingsAccountPreviewStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingsAccountPreviewStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsAccountPreviewStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
