import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BalanceAccountClientComponent } from './balance-account-client.component';

describe('BalanceAccountClientComponent', () => {
  let component: BalanceAccountClientComponent;
  let fixture: ComponentFixture<BalanceAccountClientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceAccountClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceAccountClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
