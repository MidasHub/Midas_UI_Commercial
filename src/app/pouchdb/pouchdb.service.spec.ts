import { TestBed } from '@angular/core/testing';

import { PouchdbService } from './pouchdb.service';

describe('PouchdbService', () => {
  let service: PouchdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PouchdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
