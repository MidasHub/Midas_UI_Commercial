import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MakeFeeOnAdvanceComponent } from './make-fee-on-advance.component';

describe('MakeFeeOnAdvanceComponent', () => {
  let component: MakeFeeOnAdvanceComponent;
  let fixture: ComponentFixture<MakeFeeOnAdvanceComponent>;

  beforeEach(waitForAsync(() => {
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
