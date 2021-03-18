import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferCrossOfficeComponent } from './transfer-cross-office.component';

describe('TransferCrossOfficeComponent', () => {
  let component: TransferCrossOfficeComponent;
  let fixture: ComponentFixture<TransferCrossOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferCrossOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCrossOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
