import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalConfigurationsComponent } from './global-configurations.component';

describe('GlobalConfigurationsComponent', () => {
  let component: GlobalConfigurationsComponent;
  let fixture: ComponentFixture<GlobalConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
