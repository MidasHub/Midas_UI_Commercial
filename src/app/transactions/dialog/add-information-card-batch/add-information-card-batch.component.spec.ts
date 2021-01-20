import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInformationCardBatchComponent } from './add-information-card-batch.component';

describe('AddInformationCardBatchComponent', () => {
  let component: AddInformationCardBatchComponent;
  let fixture: ComponentFixture<AddInformationCardBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInformationCardBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInformationCardBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
