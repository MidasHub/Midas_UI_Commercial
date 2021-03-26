import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientCustomerComponent } from './client-customer.component';

describe('ClientCustomerComponent', () => {
  let component: ClientCustomerComponent;
  let fixture: ComponentFixture<ClientCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
