import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoifrmDialogComponent } from './confirm-dialog.component';

describe('CoifrmDialogComponent', () => {
  let component: CoifrmDialogComponent;
  let fixture: ComponentFixture<CoifrmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoifrmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoifrmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
