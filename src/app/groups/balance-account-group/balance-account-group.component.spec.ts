import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceAccountGroupComponent } from './balance-account-group.component';


describe('BalanceAccountGroupComponent', () => {
  let component: BalanceAccountGroupComponent;
  let fixture: ComponentFixture<BalanceAccountGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceAccountGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceAccountGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
