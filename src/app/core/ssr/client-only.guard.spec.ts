import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { clientOnlyGuard } from './client-only.guard';

describe('clientOnlyGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function runGuard(platformId: string): ReturnType<typeof clientOnlyGuard> {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platformId }],
    });
    return TestBed.runInInjectionContext(() => clientOnlyGuard(route, state));
  }

  it('should allow the activation in the browser', () => {
    expect(runGuard('browser')).toBeTrue();
  });

  it('should prevent the activation on the server', () => {
    expect(runGuard('server')).toBeFalse();
  });
});
