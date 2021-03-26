import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UploadFileBillComponent } from './upload-bill.component';

describe('UploadFileBillComponent', () => {
  let component: UploadFileBillComponent;
  let fixture: ComponentFixture<UploadFileBillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
