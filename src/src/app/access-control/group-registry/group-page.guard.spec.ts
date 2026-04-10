import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { groupPageGuard } from './group-page.guard';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Increase timeout to 10 seconds

describe('GroupPageGuard', () => {
  const groupsEndpointUrl = 'https://test.org/api/eperson/groups';
  const groupUuid = '0d6f89df-f95a-4829-943c-f21f434fb892';
  const groupEndpointUrl = `${groupsEndpointUrl}/${groupUuid}`;
  const routeSnapshotWithGroupId = {
    params: {
      groupId: groupUuid,
    },
  } as unknown as ActivatedRouteSnapshot;

  let halEndpointService: HALEndpointService;
  let authorizationService: AuthorizationDataService;
  let router: Router;
  let authService: AuthService;

  function init() {
    halEndpointService = jasmine.createSpyObj(['getEndpoint']);
    ( halEndpointService as any ).getEndpoint.and.returnValue(of(groupsEndpointUrl));

    authorizationService = jasmine.createSpyObj(['isAuthorized']);
    // NOTE: value is set in beforeEach

    router = jasmine.createSpyObj(['parseUrl']);
    ( router as any ).parseUrl.and.returnValue = {};

    authService = jasmine.createSpyObj(['isAuthenticated']);
    ( authService as any ).isAuthenticated.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: HALEndpointService, useValue: halEndpointService },
      ],
    });
  }

  beforeEach(waitForAsync(() => {
    init();
  }));

  it('should be created', () => {
    expect(groupPageGuard).toBeTruthy();
  });

  describe('canActivate', () => {
    describe('when the current user can manage the group', () => {
      beforeEach(() => {
        ( authorizationService as any ).isAuthorized.and.returnValue(of(true));
      });

      it('should return true', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return groupPageGuard()(routeSnapshotWithGroupId, { url: 'current-url' } as any);
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
            FeatureID.CanManageGroup, groupEndpointUrl, undefined,
          );
          expect(result).toBeTrue();
          done();
        });
      });
    });

    describe('when the current user can not manage the group', () => {
      beforeEach(() => {
        (authorizationService as any).isAuthorized.and.returnValue(of(false));
      });

      it('should not return true', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return groupPageGuard()(routeSnapshotWithGroupId, { url: 'current-url' } as any);
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
            FeatureID.CanManageGroup, groupEndpointUrl, undefined,
          );
          expect(result).not.toBeTrue();
          done();
        });

      });
    });
  });

});
