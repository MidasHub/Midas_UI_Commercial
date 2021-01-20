import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboardComponent } from './mainboard.component';

describe('MainboardComponent', () => {
  let component: MainboardComponent;
  let fixture: ComponentFixture<MainboardComponent>;

  beforeEach(async(() => {
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
