import { TestBed } from '@angular/core/testing';

import { IsCommunityAdminGuard } from './is-community-admin.guard';

describe('IsCommunityAdminGuard', () => {
  let guard: IsCommunityAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsCommunityAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
