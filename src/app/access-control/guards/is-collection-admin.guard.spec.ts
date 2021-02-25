import { TestBed } from '@angular/core/testing';

import { IsCollectionAdminGuard } from './is-collection-admin.guard';

describe('IsCollectionAdminGuard', () => {
  let guard: IsCollectionAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsCollectionAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
