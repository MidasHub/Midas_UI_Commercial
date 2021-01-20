import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBankViewComponent } from './card-bank-view.component';

describe('CardBankViewComponent', () => {
  let component: CardBankViewComponent;
  let fixture: ComponentFixture<CardBankViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBankViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBankViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
