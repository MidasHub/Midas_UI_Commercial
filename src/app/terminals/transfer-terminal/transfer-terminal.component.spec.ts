import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTerminalComponent } from './Transfer-terminal.component';

describe('TransferTerminalComponent', () => {
  let component: TransferTerminalComponent;
  let fixture: ComponentFixture<TransferTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
