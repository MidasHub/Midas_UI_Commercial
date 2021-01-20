import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillposSelectorComponent } from './billpos-selector.component';

describe('BillposSelectorComponent', () => {
  let component: BillposSelectorComponent;
  let fixture: ComponentFixture<BillposSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillposSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillposSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
