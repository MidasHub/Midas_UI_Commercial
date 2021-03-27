import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFeeOnAdvanceComponent } from './make-fee-on-advance.component';

describe('MakeFeeOnAdvanceComponent', () => {
  let component: MakeFeeOnAdvanceComponent;
  let fixture: ComponentFixture<MakeFeeOnAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeFeeOnAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeFeeOnAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
