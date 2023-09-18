import { TestBed } from '@angular/core/testing';

import { LdnServicesGuard } from './ldn-services-guard.service';

describe('LdnServicesGuard', () => {
  let guard: LdnServicesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LdnServicesGuard);
  });

  it('should be created', () => {
    // @ts-ignore
    expect(guard).toBeTruthy();
  });
});
