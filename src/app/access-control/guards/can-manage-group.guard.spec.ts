import { TestBed } from '@angular/core/testing';

import { CanManageGroupGuard } from './can-manage-group.guard';

describe('CanManageGroupGuard', () => {
  let guard: CanManageGroupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanManageGroupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
