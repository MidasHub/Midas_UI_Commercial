import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAdvanceCashComponent } from './partner-advance-cash.component';

describe('PartnerAdvanceCashComponent', () => {
  let component: PartnerAdvanceCashComponent;
  let fixture: ComponentFixture<PartnerAdvanceCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerAdvanceCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerAdvanceCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
