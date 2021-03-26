import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewClosureComponent } from './view-closure.component';

describe('ViewClosureComponent', () => {
  let component: ViewClosureComponent;
  let fixture: ComponentFixture<ViewClosureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
