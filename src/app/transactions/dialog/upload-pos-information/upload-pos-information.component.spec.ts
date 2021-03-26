import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadPosInformationComponent } from './upload-pos-information.component';

describe('UploadPosInformationComponent', () => {
  let component: UploadPosInformationComponent;
  let fixture: ComponentFixture<UploadPosInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPosInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPosInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
