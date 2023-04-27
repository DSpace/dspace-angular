import { TestBed } from '@angular/core/testing';

import { MetadataItemService } from './metadata-item.service';

describe('MetadataItemService', () => {
  let service: MetadataItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
