import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BillsManageComponent } from './bills-manage.component';

describe('BillsManageComponent', () => {
  let component: BillsManageComponent;
  let fixture: ComponentFixture<BillsManageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
