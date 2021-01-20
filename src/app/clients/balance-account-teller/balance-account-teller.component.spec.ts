import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceAccountTellerComponent } from './balance-account-teller.component';

describe('BalanceAccountTellerComponent', () => {
  let component: BalanceAccountTellerComponent;
  let fixture: ComponentFixture<BalanceAccountTellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceAccountTellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceAccountTellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
