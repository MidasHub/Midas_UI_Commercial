import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaidManagementComponent } from './fee-paid-management.component';

describe('FeePaidManagementComponent', () => {
  let component: FeePaidManagementComponent;
  let fixture: ComponentFixture<FeePaidManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeePaidManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeePaidManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
