import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFileBillComponent } from './upload-bill.component';

describe('UploadFileBillComponent', () => {
  let component: UploadFileBillComponent;
  let fixture: ComponentFixture<UploadFileBillComponent>;

  beforeEach(async(() => {
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
