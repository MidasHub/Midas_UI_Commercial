import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageIcTransactionComponent } from './manage-ic-transaction.component';


describe('ManageIcTransactionComponent', () => {
  let component: ManageIcTransactionComponent;
  let fixture: ComponentFixture<ManageIcTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIcTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIcTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
