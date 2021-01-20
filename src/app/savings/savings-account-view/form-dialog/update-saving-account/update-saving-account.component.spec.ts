import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSavingAccountComponent } from './update-saving-account.component';

describe('UpdateSavingAccountComponent', () => {
  let component: UpdateSavingAccountComponent;
  let fixture: ComponentFixture<UpdateSavingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSavingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSavingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
