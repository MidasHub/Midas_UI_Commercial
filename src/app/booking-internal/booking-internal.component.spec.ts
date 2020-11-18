import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInternalComponent } from './booking-internal.component';

describe('BookingInternalComponent', () => {
  let component: BookingInternalComponent;
  let fixture: ComponentFixture<BookingInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
