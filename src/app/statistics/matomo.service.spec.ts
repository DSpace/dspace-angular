import { TestBed } from '@angular/core/testing';

import { MatomoService } from './matomo.service';

describe('MatomoService', () => {
  let service: MatomoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatomoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
