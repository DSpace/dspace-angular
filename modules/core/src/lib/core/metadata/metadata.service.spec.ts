import { TestBed } from '@angular/core/testing';

import { MetadataService } from '@dspace/core';

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
