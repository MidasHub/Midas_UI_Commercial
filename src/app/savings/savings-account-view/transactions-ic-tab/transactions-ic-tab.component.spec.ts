import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsIcTabComponent } from './transactions-ic-tab.component';


describe('TransactionsIcTabComponent', () => {
  let component: TransactionsIcTabComponent;
  let fixture: ComponentFixture<TransactionsIcTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsIcTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsIcTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
