import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollTermScheduleTransactionComponent } from './rollTerm-schedule-transaction.component';

describe('RollTermScheduleTransactionComponent', () => {
  let component: RollTermScheduleTransactionComponent;
  let fixture: ComponentFixture<RollTermScheduleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTermScheduleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTermScheduleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
