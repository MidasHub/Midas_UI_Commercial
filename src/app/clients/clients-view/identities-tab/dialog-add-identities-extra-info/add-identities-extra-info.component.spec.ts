import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIdentitiesExtraInfoComponent } from './add-identities-extra-info.component';

describe('AddIdentitiesExtraInfoComponent', () => {
  let component: AddIdentitiesExtraInfoComponent;
  let fixture: ComponentFixture<AddIdentitiesExtraInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIdentitiesExtraInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIdentitiesExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
