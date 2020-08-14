import { TestBed } from '@angular/core/testing';

import { OpennessService } from './openness-service.service';

describe('OpennessServiceService', () => {
  let service: OpennessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpennessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
