import { TestBed } from '@angular/core/testing';

import { ServerCheckGuard } from './server-check.guard';

describe('ServerCheckGuard', () => {
  let guard: ServerCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ServerCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
