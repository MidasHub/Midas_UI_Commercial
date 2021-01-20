import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceAccountClientComponent } from './balance-account-client.component';

describe('BalanceAccountClientComponent', () => {
  let component: BalanceAccountClientComponent;
  let fixture: ComponentFixture<BalanceAccountClientComponent>;

  beforeEach(async(() => {
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
