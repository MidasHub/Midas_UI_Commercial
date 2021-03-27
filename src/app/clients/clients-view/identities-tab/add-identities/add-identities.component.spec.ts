import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdentitiesComponent } from './add-identities.component';

describe('AddIdentitiesComponent', () => {
  let component: AddIdentitiesComponent;
  let fixture: ComponentFixture<AddIdentitiesComponent>;

  beforeEach(async(() => {
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
