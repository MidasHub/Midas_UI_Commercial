import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingManageComponent } from './booking-manage.component';

describe('BookingManageComponent', () => {
  let component: BookingManageComponent;
  let fixture: ComponentFixture<BookingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
