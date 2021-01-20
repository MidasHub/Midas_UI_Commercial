import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidasClientComponent } from './midas-client.component';

describe('ProfileComponent', () => {
  let component: MidasClientComponent;
  let fixture: ComponentFixture<MidasClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidasClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidasClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
