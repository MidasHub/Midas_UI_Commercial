import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvanceFeeRollTermComponent } from './advance-fee-roll-term.component';


describe('AdvanceFeeRollTermComponent', () => {
  let component: AdvanceFeeRollTermComponent;
  let fixture: ComponentFixture<AdvanceFeeRollTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFeeRollTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFeeRollTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
