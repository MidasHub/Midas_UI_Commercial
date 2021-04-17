import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSpendingComponent } from './create-edit-spending.component';

describe('CreateEditSpendingComponent', () => {
  let component: CreateEditSpendingComponent;
  let fixture: ComponentFixture<CreateEditSpendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditSpendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
