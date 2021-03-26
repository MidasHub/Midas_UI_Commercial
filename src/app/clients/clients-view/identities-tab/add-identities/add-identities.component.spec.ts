import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIdentitiesComponent } from './add-identities.component';

describe('AddIdentitiesComponent', () => {
  let component: AddIdentitiesComponent;
  let fixture: ComponentFixture<AddIdentitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIdentitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
