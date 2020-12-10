import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateMarketingComponent } from './create-update-marketing.component';

describe('CreateUpdateMarketingComponent', () => {
  let component: CreateUpdateMarketingComponent;
  let fixture: ComponentFixture<CreateUpdateMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
