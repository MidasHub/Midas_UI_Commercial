import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewLimitTerminalComponent } from './view-limit-terminal.component';


describe('ViewLimitTerminalComponent', () => {
  let component: ViewLimitTerminalComponent;
  let fixture: ComponentFixture<ViewLimitTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLimitTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLimitTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
