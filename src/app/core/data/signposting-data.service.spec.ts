import { TestBed } from '@angular/core/testing';

import { SignpostingDataService } from './signposting-data.service';

describe('SignpostingDataService', () => {
  let service: SignpostingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignpostingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
