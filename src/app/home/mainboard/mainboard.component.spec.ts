import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainboardComponent } from './mainboard.component';

describe('MainboardComponent', () => {
  let component: MainboardComponent;
  let fixture: ComponentFixture<MainboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
