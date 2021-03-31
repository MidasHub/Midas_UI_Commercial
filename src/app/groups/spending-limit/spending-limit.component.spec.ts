import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingLimitComponent } from './spending-limit.component';

describe('SpendingLimitComponent', () => {
  let component: SpendingLimitComponent;
  let fixture: ComponentFixture<SpendingLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendingLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
