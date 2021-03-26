import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportTransactionsIcComponent } from './export-transactions-ic.component';


describe('ExportTransactionsIcComponent', () => {
  let component: ExportTransactionsIcComponent;
  let fixture: ComponentFixture<ExportTransactionsIcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportTransactionsIcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTransactionsIcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
