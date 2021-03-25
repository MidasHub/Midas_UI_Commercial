import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCustomerComponent } from './client-customer.component';

describe('ClientCustomerComponent', () => {
  let component: ClientCustomerComponent;
  let fixture: ComponentFixture<ClientCustomerComponent>;

  beforeEach(async(() => {
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
