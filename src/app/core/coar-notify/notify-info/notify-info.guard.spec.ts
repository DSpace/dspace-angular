import { TestBed } from '@angular/core/testing';

import { NotifyInfoGuard } from './notify-info.guard';

describe('NotifyInfoGuard', () => {
  let guard: NotifyInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotifyInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
