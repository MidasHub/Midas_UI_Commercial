import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DueDayCardTabComponent } from './due-day-card-tab.component';


describe('DueDayCardTabComponent', () => {
  let component: DueDayCardTabComponent;
  let fixture: ComponentFixture<DueDayCardTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueDayCardTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DueDayCardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
