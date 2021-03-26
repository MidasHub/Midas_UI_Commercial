import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddLimitIdentitiesExtraInfoComponent } from './dialog-add-limit-extra-info.component';


describe('AddLimitIdentitiesExtraInfoComponent', () => {
  let component: AddLimitIdentitiesExtraInfoComponent;
  let fixture: ComponentFixture<AddLimitIdentitiesExtraInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLimitIdentitiesExtraInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLimitIdentitiesExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
