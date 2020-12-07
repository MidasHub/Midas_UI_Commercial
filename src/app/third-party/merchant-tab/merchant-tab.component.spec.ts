import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantTabComponent } from './merchant-tab.component';

describe('MerchantTabComponent', () => {
  let component: MerchantTabComponent;
  let fixture: ComponentFixture<MerchantTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
