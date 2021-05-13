import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoifrmDialogComponent } from './confirm-dialog.component';

describe('CoifrmDialogComponent', () => {
  let component: CoifrmDialogComponent;
  let fixture: ComponentFixture<CoifrmDialogComponent>;

  beforeEach(async(() => {
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
