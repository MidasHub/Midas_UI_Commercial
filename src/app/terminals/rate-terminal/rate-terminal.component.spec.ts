import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTerminalComponent } from './rate-terminal.component';

describe('RateTerminalComponent', () => {
  let component: RateTerminalComponent;
  let fixture: ComponentFixture<RateTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateTerminalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
