import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListStandingInstructionsComponent } from './list-standing-instructions.component';

describe('ListStandingInstructionsComponent', () => {
  let component: ListStandingInstructionsComponent;
  let fixture: ComponentFixture<ListStandingInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStandingInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStandingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
