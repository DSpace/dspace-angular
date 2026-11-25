import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { SsrExcludeStrategy } from '../../../config/ssr-config.interface';
import { clientOnlyGuard } from './client-only.guard';

describe('clientOnlyGuard', () => {
  const excludePathPatterns = [
    { pattern: '^/search' },
    { pattern: '^/communities/[a-f0-9-]{36}/(browse|search)(/.*)?$', flag: 'i' },
  ];

  function runGuard(
    platformId: string,
    url: string,
    path = 'search',
    excludePathStrategy: SsrExcludeStrategy | undefined = 'router',
  ): ReturnType<typeof clientOnlyGuard> {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: APP_CONFIG, useValue: { ssr: { excludePathPatterns, excludePathStrategy } } },
      ],
    });
    return TestBed.runInInjectionContext(() => clientOnlyGuard({ routeConfig: { path } } as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
  }

  describe(`with the 'router' strategy`, () => {
    it('should allow every path in the browser', () => {
      expect(runGuard('browser', '/search')).toBeTrue();
    });

    it('should prevent excluded paths on the server', () => {
      expect(runGuard('server', '/search')).toBeFalse();
    });

    it('should ignore query params when matching on the server', () => {
      expect(runGuard('server', '/search?query=test')).toBeFalse();
    });

    it('should apply the pattern flag when matching on the server', () => {
      expect(runGuard('server', '/communities/123E4567-E89B-12D3-A456-426614174000/browse')).toBeFalse();
    });

    it('should never block the wildcard route, so unknown paths still give a 404', () => {
      expect(runGuard('server', '/search/unknown', '**')).toBeTrue();
    });

    it('should allow non excluded paths on the server', () => {
      expect(runGuard('server', '/home')).toBeTrue();
    });
  });

  describe(`with the 'server' strategy`, () => {
    it('should allow excluded paths on the server, as server.ts already handles them', () => {
      expect(runGuard('server', '/search', 'search', 'server')).toBeTrue();
    });
  });

  describe('without a configured strategy', () => {
    it(`should default to the 'router' strategy`, () => {
      expect(runGuard('server', '/search', 'search', undefined)).toBeFalse();
    });
  });
});
