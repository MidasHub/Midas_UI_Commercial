import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantDialogComponent } from './merchant-dialog.component';


describe('MerchantTabComponent', () => {
  let component: MerchantDialogComponent;
  let fixture: ComponentFixture<MerchantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
