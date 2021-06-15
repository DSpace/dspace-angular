import { TestBed } from '@angular/core/testing';

import { GroupPageGuard } from './group-page.guard';

describe('GroupPageGuard', () => {
  let guard: GroupPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GroupPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
