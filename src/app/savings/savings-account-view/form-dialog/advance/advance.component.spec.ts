import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceComponent } from './advance.component';

describe('AdvanceComponent', () => {
  let component: AdvanceComponent;
  let fixture: ComponentFixture<AdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
