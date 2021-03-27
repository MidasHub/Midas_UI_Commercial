import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPosInformationComponent } from './upload-pos-information.component';

describe('UploadPosInformationComponent', () => {
  let component: UploadPosInformationComponent;
  let fixture: ComponentFixture<UploadPosInformationComponent>;

  beforeEach(async(() => {
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
