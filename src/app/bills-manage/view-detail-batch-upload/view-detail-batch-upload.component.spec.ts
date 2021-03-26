import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewDetailBatchUploadComponent } from './view-detail-batch-upload.component';

describe('ViewDetailBatchUploadComponent', () => {
  let component: ViewDetailBatchUploadComponent;
  let fixture: ComponentFixture<ViewDetailBatchUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailBatchUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailBatchUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
