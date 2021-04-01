import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerbannerComponent } from './customerbanner.component';

describe('CustomerbannerComponent', () => {
  let component: CustomerbannerComponent;
  let fixture: ComponentFixture<CustomerbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
