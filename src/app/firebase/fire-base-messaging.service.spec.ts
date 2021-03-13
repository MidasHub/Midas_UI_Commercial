import { TestBed } from '@angular/core/testing';

import { FireBaseMessagingService } from './fire-base-messaging.service';

describe('FireBaseMessagingService', () => {
  let service: FireBaseMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireBaseMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
