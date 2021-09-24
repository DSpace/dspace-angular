import { TestBed } from '@angular/core/testing';

import { ItemVersionsSharedService } from './item-versions-shared.service';

describe('ItemVersionsSharedService', () => {
  let service: ItemVersionsSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemVersionsSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
