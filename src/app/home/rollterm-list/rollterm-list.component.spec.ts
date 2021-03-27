import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolltermListComponent } from './rollterm-list.component';

describe('RolltermListComponent', () => {
  let component: RolltermListComponent;
  let fixture: ComponentFixture<RolltermListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolltermListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolltermListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
