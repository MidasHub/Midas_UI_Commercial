import { TestBed } from '@angular/core/testing';

import { LuhnService } from './luhn.service';

describe('LuhnService', () => {
  let service: LuhnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuhnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
