import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndueCardComponent } from './ondue-card.component';

describe('OndueCardComponent', () => {
  let component: OndueCardComponent;
  let fixture: ComponentFixture<OndueCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndueCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
