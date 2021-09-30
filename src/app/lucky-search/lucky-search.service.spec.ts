import { TestBed } from '@angular/core/testing';

import { LuckySearchService } from './lucky-search.service';

describe('LuckySearchService', () => {
  let service: LuckySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuckySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
